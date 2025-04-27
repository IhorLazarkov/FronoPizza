'use strict';
const options = { tableName: "Ingredients" };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Ingredient } = require('../models');
const ingredients = [
  {
    name: 'Parmesan Cheese',
    price: 2,
    image: 'https://example.com/cheese.jpg'
  },
  {
    name: 'Olive Oil',
    price: 1,
    image: 'https://example.com/olive-oil.jpg'
  },
  {
    name: 'Garlic Sauce',
    price: 1,
    image: 'https://example.com/garlic.jpg'
  },
  {
    name: 'Tomato Sauce',
    price: 1,
    image: 'https://example.com/tomato-sauce.jpg'
  }
];
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
    ingredients.forEach(async i => {
      await Ingredient.create(i)
    })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    ingredients.forEach(async i => {
      await Ingredient.destroy({ where: { name: i.name } })
    })
  }
};
