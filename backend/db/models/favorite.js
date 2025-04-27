'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.hasMany(models.User, {
        foreignKey: 'user_id',
      });
      Favorite.hasMany(models.Pizza, {
        foreignKey: 'pizza_id',
      });
    }
  }
  Favorite.init({
    pizza_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};