const express = require('express');
const router = express.Router();
const { Favorite, Pizza } = require('../../db/models');

/**
 * @description Add a favorite
 */
router.post('/', async (req, res) => {
    const { user } = req;
    const { pizzaId } = req.body;

    const pizza = await Pizza.findByPk(pizzaId);
    if (!pizza) {
        return res.status(404).json({
            message: 'Pizza not found'
        });
    }

    await Favorite.create({
        user_id: user.id,
        pizza_id: pizzaId
    });
    
    res.status(201).json({ message: 'success' });
});

/**
 * @description Remove a favorite
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const favorite = await Favorite.findOne({
        where:{ pizza_id: id }
    });
    if (!favorite) {
        return res.status(404).json({
            message: 'Favorite not found'
        });
    }
    await favorite.destroy();
    res.send({ message: 'success' })
});

module.exports = router;