const router = require("express").Router();
const {
    Ingredient
} = require("../../db/models");

/**
 * @description Get all ingredients
 */
router.get("/", async (_req, res, next) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.json(ingredients);
    } catch (error) {
        next(new Error(`Error get all ingredients: ${error}`));
    }
});

module.exports = router;
