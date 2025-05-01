const router = require("express").Router();
const {
    Ingredient,
    Pizza
} = require("../../db/models");

/**
 * @description Get all ingredients that are not in a pizza
 */
router.get("/", async (_req, res, next) => {
    try {
        const ingredients = await Ingredient.findAll({
            attributes: ["id", "name", "image", "price"],
            include: { model: Pizza },
        });
        res.json(ingredients.filter(i => !i.Pizzas.length));
    } catch (error) {
        next(new Error(`Error get all ingredients: ${error}`));
    }
});

module.exports = router;
