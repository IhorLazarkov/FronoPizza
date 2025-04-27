'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING.BINARY,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};