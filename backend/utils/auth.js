const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, SpotImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}

const requireAuthorization = async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }
    if (spot.ownerId !== userId) {
      const err = new Error('Forbbiden');
      err.title = 'Forbidden';
      err.errors = { message: 'Forbidden' }
      err.status = 403;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const requireReviewAuthorization = async (req, res, next) => {

  const { reviewId } = req.params;
  const { id: userId } = req.user;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      const error = new Error("Review couldn't be found")
      error.status = 404
      error.title = "Review couldn't be found"
      error.errors = { message: "Review couldn't be found" }
      return next(error)
    }

    if (review.userId !== userId) {
      const err = new Error('Forbbiden');
      err.title = 'Forbidden';
      err.errors = { message: 'Forbidden' }
      err.status = 403;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const requireSpotImageAuthorization = async (req, res, next) => {

  const { imageId } = req.params;
  const { id: userId } = req.user;

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: [{ model: Spot }]
    });
    if (!spotImage) {
      const error = new Error("Spot Image couldn't be found")
      error.status = 404
      error.title = "Spot Image couldn't be found"
      error.errors = { message: "Spot Image couldn't be found" }
      return next(error)
    }

    if (spotImage.Spot.ownerId !== userId) {
      const err = new Error('Forbbiden');
      err.title = 'Forbidden';
      err.errors = { message: 'Forbidden' }
      err.status = 403;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const requireNotOwnerAuthorization = async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
          const err = new Error("Spot couldn't be found");
          err.status = 404;
          return next(err);
      }

      // Check if the user owns the spot
      if (spot.ownerId === userId) {
          const err = new Error('Forbidden');
          err.message = "You cannot book your own spot";
          err.status = 403;
          return next(err);
      }

      // Add spot to the request object for reuse in the route
      req.spot = spot;
      next();
  } catch (error) {
      next(error);
  }
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  requireAuthorization,
  requireReviewAuthorization,
  requireSpotImageAuthorization,
  requireNotOwnerAuthorization
};