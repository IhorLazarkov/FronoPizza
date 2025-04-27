'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PizzaIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PizzaIngredient.belongsTo(models.Pizza, {
        foreignKey: 'pizza_id',
      });
      PizzaIngredient.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
      });
    }
  }
  PizzaIngredient.init({
    pizza_id: DataTypes.INTEGER,
    ingredient_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PizzaIngredient',
  });
  return PizzaIngredient;
};