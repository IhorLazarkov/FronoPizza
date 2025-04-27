'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pizza extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pizza.belongsToMany(models.Ingredient, {
        through: 'PizzaIngredientes',
        foreignKey: 'pizza_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
      Pizza.hasMany(models.Favorite, {
        foreignKey: 'pizza_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
      Pizza.belongsToMany(models.Order, {
        foreignKey: 'pizza_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }
  Pizza.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pizza',
  });
  return Pizza;
};