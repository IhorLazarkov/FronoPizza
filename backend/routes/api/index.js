const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const userRouter = require('./users.js');
const sessionRouter = require('./session.js');
const pizzaRouter = require('./pizzas.js');
const reviewRouter = require('./reviews.js');
const currentRouter = require('./current.js');
const ingredientRouter = require('./ingredients.js');
const orderRouter = require('./orders.js');
const favoriteRouter = require('./favorites.js');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/users', userRouter);

router.use('/session', sessionRouter);

router.use('/pizzas', pizzaRouter);

router.use('/reviews', reviewRouter);

router.use('/current', currentRouter);

router.use('/ingredients', ingredientRouter);

router.use('/orders', orderRouter);

router.use('/favorites', favoriteRouter);

module.exports = router;