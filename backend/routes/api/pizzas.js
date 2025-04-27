
const { Pizza, Ingredient } = require("../../db/models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const pizzas = await Pizza.findAll({
    include:[{model: Ingredient}]
  });
  res.json(pizzas);
});

module.exports = router;
