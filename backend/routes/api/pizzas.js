
const { Pizza } = require("../../db/models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const pizzas = await Pizza.findAll();
  res.json(pizzas);
});

module.exports = router;
