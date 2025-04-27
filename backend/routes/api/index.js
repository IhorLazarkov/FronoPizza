const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const userRouter = require('./users.js');
const sessionRouter = require('./session.js');
const pizzaRouter = require('./pizzas.js');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/users', userRouter);

router.use('/session', sessionRouter);

router.use('/pizzas', pizzaRouter);

module.exports = router;