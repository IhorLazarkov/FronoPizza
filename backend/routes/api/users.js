const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth.js');
const router = require('express').Router();
const bcrypt = require('bcryptjs');

/**
 * @description Signup a User
 */
router.post('/', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if(existingUser){
        const errors = {}
        errors.email = 'User with that email already exists';

        return res.status(403).json({
            message: "User already exists",
            errors
        });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, hashedPassword, firstName, lastName });

    setTokenCookie(res, user);
    return res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
});

module.exports = router;