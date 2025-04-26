const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const userRouter = require('./users.js');
const sessionRouter = require('./session.js');

router.use(restoreUser);

router.use('/users', userRouter);

router.use('/session', sessionRouter);

module.exports = router;