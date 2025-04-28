
const {
  Pizza,
  Ingredient,
  Review,
  User,
  sequelize
} = require("../../db/models");

const router = require("express").Router();

/**
 * @description Get all pizzas
 */
router.get("/", async (_req, res, next) => {
  try {

    const pizzas = await Pizza.findAll({
      include: [{
        model: Review,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'reviewsCount'],
          [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'rating']
        ]
      }]
    });

    res.json(pizzas);
  } catch (error) {
    next(new Error(`Error get all pizzas: ${error}`));
  }
});

/**
 * @description Get pizza Details
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findByPk(id, {
      include: [{
        model: Ingredient,
        attributes: ['id', 'name'],
      },
      {
        model: Review,
        attributes: ['id', 'rating', 'review', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }]
      }]
    });

    if (!pizza) {
      const error = new Error()
      error.status = 404;
      error.message = `Pizza with id ${id} not found`;
      return next(error);
    }

    res.json(pizza);
    
  } catch (error) {
    const err = new Error()
    err.status = 500;
    err.message = `Error get pizza by id: ${error}`;
    next(err);
  }
});

module.exports = router;
