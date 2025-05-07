'use strict';
const {
  User,
  Pizza,
  Ingredient,
  Order,
  OrderItem,
} = require('../models');
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
    const order = await Order.create({
      user_id: user.id,
      totalPrice: 12,
      status: 'ready'
    });
    await OrderItem.create({
      order_id: order.id,
      pizza_id: pizza.id,
      quantity: 1,
    });
    await OrderItem.create({
      order_id: order.id,
      ingredient_id: ingredient.id,
      quantity: 1,
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
