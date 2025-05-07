const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth.js');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

/**
 * @description Login route
 */
router.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
    }

    await setTokenCookie(res, user);

    return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
});

/**
 * @description Logout route
 */
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: "success" });
});

/**
 * @description Restore session user
 */
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        return res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    else { return res.json({ user: null }); }
})

module.exports = router;