const router = require('express').Router();

const { User, Pizza, Review } = require('../../db/models');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const reviews = await Review.findByPk(id, {
        include: [{
            model: User,
            attributes: ["id", "firstName", "lastName"]
        }, {
            model: Pizza,
            attributes: ["id", "name"]
        }]
    });
    reviews = res.json(reviews || {});
});

router.post('/', async (req, res, next) => {
    try {
        const { user, body } = req;
        const userModel = await User.findByPk(user.id);
        const pizzaModel = await Pizza.findByPk(body.pizzaId);
        const newReview = await Review.create({
            ...body,
            UserId: userModel.id,
            PizzaId: pizzaModel
        })
        const review = await Review.findOne({
            where: { id: newReview.id },
            include: { model: Pizza }
        })

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req.body;
        const review = await Review.findByPk(id);
        await review.update(body);
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        await review.destroy();
        res.sendStatus(200).json({ message: "success" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;