
const {
  Pizza,
  Ingredient,
  Review
} = require("../../db/models");

const router = require("express").Router();

/**
 * @description Get all pizzas
 */
router.get("/", async (_req, res, next) => {
  try {

    const pizzas = await Pizza.findAll({
      include: [{
        model: Review
      }]
    });

    res.json(pizzas);
  } catch (error) {
    next(new Error(`Error get all pizzas: ${error}`));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findByPk(id, {
      include: [{
        model: Ingredient,
        model: Review
      }]
    });
    res.json(pizza);
  } catch (error) {
    next(new Error(`Error get pizza by id: ${error}`));
  }
});

module.exports = router;
