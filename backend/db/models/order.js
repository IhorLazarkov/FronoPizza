'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      Order.belongsTo(models.Pizza, {
        foreignKey: 'pizza_id',
      });
      Order.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    pizza_id: DataTypes.INTEGER,
    ingredient_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};