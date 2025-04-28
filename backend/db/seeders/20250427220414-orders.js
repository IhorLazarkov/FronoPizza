'use strict';
const { Order, User, Pizza, Ingredient } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const user = await User.findOne();
    const pizza = await Pizza.findOne();
    const ingredient = await Ingredient.findOne();
    await Order.create({
      user_id: user.id,
      pizza_id: pizza.id,
      ingredient_id: ingredient.id,
      quantity: 1,
      status: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
