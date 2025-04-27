'use strict';
const { Pizza, Ingredient, PizzaIngredient } = require('../models');
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

    const pizza = await Pizza.create({
      name: 'Pizza Margherita',
      price: 10,
      image: 'https://example.com/pizza-margherita.jpg',
      description: 'A classic Italian pizza with tomato sauce, mozzarella cheese, and fresh basil.'
    });
    const ingredients = await Ingredient.bulkCreate([
      {
        name: 'Tomato',
        price: 2,
        image: 'https://example.com/tomato.jpg'
      },
      {
        name: 'Mozzarella',
        price: 3,
        image: 'https://example.com/mozzarella.jpg'
      },
      {
        name: 'Basil',
        price: 1,
        image: 'https://example.com/basil.jpg'
      }
    ]);
    await pizza.addIngredient(ingredients);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const pizzas = await Pizza.findAll();
    pizzas.forEach(async (pizza) => {

      // Cleanup Pizza and its ingredients
      await pizza.destroy();

      // Cleanup the PizzaIngredientes table
      await PizzaIngredient.destroy({
        where: { pizza_id: pizza.id },
      });
    });
  }
};
