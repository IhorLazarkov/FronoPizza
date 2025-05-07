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
    image: 'https://assets.clevelandclinic.org/transform/LargeFeatureImage/0a272376-d2c4-4936-8239-7c7ef2e5b4e9/ParmesanCheese-471343790-770x533-1_jpg'
  },
  {
    name: 'Olive Oil',
    price: 1,
    image: 'https://www.health.com/thmb/VD31swL_h-hrJYyYZ8FRE9-VL-o=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/evoo-7c819bcdd0c343a7bae114cbc9baea2f.jpg'
  },
  {
    name: 'Garlic Sauce',
    price: 1,
    image: 'https://www.allrecipes.com/thmb/WPQvfZ5wDvdpvHb2_bgZP3dxfHg=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/AR-81240-creamy-garlic-sauce-DDMFS-4x3-Beauty-6ca78d6c44f94c86af9607cf323e2968.jpg'
  },
  {
    name: 'Tomato Sauce',
    price: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Fresh_Tomato_Sauce_%28Unsplash%29.jpg/500px-Fresh_Tomato_Sauce_%28Unsplash%29.jpg'
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
