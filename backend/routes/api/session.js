const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth.js');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

/**
 * @description Login route
 */
router.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
    }

    await setTokenCookie(res, user);
    return res.json({
        user
    });

});

/**
 * @description Logout route
 */
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: "success" });
});

module.exports = router;