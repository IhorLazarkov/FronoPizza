const { User } = require('../../db/models');
const { serTokenCookie } = require('../../utils/auth.js');
const router = require('express').Router();


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

    await serTokenCookie(res, user);
    return res.status(201).json({
        user
    });
});

module.exports = router;