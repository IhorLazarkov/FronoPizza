'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Pizza, {
        foreignKey: 'pizza_id',
      });
      OrderItem.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
      });
    }
  }
  OrderItem.init({
    order_id: DataTypes.INTEGER,
    pizza_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};