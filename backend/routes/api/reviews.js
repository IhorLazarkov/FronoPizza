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
    reviews = 
    res.json(reviews || {});
});

module.exports = router;