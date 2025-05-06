'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      Review.belongsTo(models.Pizza, {
        foreignKey: 'pizza_id',
      });
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    pizza_id: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      }
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};