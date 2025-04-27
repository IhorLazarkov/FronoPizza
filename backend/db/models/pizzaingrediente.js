'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PizzaIngrediente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PizzaIngrediente.belongsTo(models.Pizza, {
        foreignKey: 'pizza_id',
      });
      PizzaIngrediente.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
      });
    }
  }
  PizzaIngrediente.init({
    pizza_id: DataTypes.INTEGER,
    ingredient_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PizzaIngrediente',
  });
  return PizzaIngrediente;
};