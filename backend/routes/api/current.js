const router = require('express').Router();
const { Review, User, Favorite, Pizza, Order, Ingredient } = require('../../db/models');

router.get('/reviews', async (req, res) => {
    const reviews = await Review.findAll({
        include: [{
            model: User,
            attributes: ['firstName', 'lastName']
        }]
    });
    res.json(reviews);
});

router.get('/favorites', async (req, res) => {
    const { user } = req;
    console.log({ user });
    const favorites = await Favorite.findAll({
        where: {
            user_id: user.id
        },
        include: [{
            model: User,
            attributes: []
        }, {
            model: Pizza,
            attributes: ['id', 'name', 'description', 'price', 'image']
        }]
    });
    res.json(favorites);
});

router.get('/orders', async (req, res) => {
    const { user } = req;
    const orders = await Order.findAll({
        where: {
            user_id: user.id
        },
        include: [{
            model: User,
            attributes: []
        }, {
            model: Pizza,
            attributes: ['id', 'name', 'price', 'image']
        }, {
            model: Ingredient,
            attributes: ['id', 'name', 'image', 'price']
        }]
    });
    res.json(orders);
});

module.exports = router;