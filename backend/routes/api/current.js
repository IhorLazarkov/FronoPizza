const router = require('express').Router();
const {
    User,
    Review,
    Favorite,
    Pizza,
    Ingredient,
    Order,
    OrderItem,
} = require('../../db/models');

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
    const favorites = await Favorite.findAll({
        where: {
            user_id: user.id
        },
        include: [{
            model: User,
            attributes: []
        }, {
            model: Pizza,
            attributes: ['id']
        }]
    });
    const result = favorites.map(({ Pizza }) => {
        return { id: Pizza.id }
    });
    res.json(result);
});

router.get('/orders', async (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(403).json({
            message: 'Get orders not avaiilable for guests'
        })
    }
    try {
        const orders = await Order.findAll({
            where: {
                user_id: req.user.id
            },
            include: [
                {
                    model: OrderItem,
                    attributes: ['quantity'],
                    include: [
                        {
                            model: Pizza,
                            attributes: ['name', 'price'],
                        },
                        {
                            model: Ingredient,
                            attributes: ['name', 'price'],
                        }
                    ]
                },
            ],
            attribute: ['id', 'totalPrice', 'updatedAt'],
        })
        res.json(orders)
    } catch (err) {
        next(err)
    }
});

module.exports = router;