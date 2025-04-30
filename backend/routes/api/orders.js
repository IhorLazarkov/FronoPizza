const express = require('express');
const { sequelize, Order, OrderItem, Pizza, Ingredient } = require('../../db/models');
const router = express.Router();

router.post('/', async (req, res, next) => {
    const { user } = req;
    const { pizzas, ingredients } = req.body;
    const aggregatePizzas = {}
    const aggregateIngredients = {}
    let totalPrice = 0

    // Aggregate pizzas
    for (const pizza of pizzas) {
        if (!aggregatePizzas[pizza.id]) {
            aggregatePizzas[pizza.id] = {
                quantity: pizza.quantity
            }
        } else {
            aggregatePizzas[pizza.id].quantity += 1
        }
        totalPrice += pizza.price
    }

    // Aggregate ingredients
    for (const ingredient of ingredients) {
        if (!aggregateIngredients[ingredient.id]) {
            aggregateIngredients[ingredient.id] = {
                quantity: ingredient.quantity
            }
        } else {
            aggregateIngredients[ingredient.id].quantity += 1
        }
        totalPrice += ingredient.price
    }

    // Create a transaction
    let order;
    const t = await sequelize.transaction();

    try {

        // Creste order
        order = await Order.create({
            user_id: user.id,
            totalPrice: totalPrice
            // status: use default value
        })

        // Create order items for pizzas
        for (item in aggregatePizzas) {
            console.log({ pizza: item });
            await OrderItem.create({
                order_id: order.id,
                pizza_id: item,
                quantity: aggregatePizzas[item].quantity
            })
        }

        // Create order items for ingredients
        for (item in aggregateIngredients) {
            console.log({ ingredient: item });
            await OrderItem.create({
                order_id: order.id,
                ingredient_id: item,
                quantity: aggregateIngredients[item].quantity,
            })
        }

        // Commit the transaction
        await t.commit();

    } catch (err) {

        // Rollback the transaction
        await t.rollback();
        await Order.destroy({
            where: {
                id: order.id
            }
        })
        return next(err);
    }

    res.status(201).json({
        pizzas: aggregatePizzas,
        ingredients: aggregateIngredients,
        totalPrice
    });
})

module.exports = router;

