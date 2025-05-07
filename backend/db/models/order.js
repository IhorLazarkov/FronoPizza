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
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Order.init({
    user_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Demo user
    },
    totalPrice: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'accepted',
      isIn: [['accepted', 'preparing', 'in oven', 'ready']]
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};