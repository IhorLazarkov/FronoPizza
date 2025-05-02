'use strict';
const { where, Op } = require('sequelize');
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

    const margherita = await Pizza.create({
      name: 'Pizza Margherita',
      price: 10,
      image: 'https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg',
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
    await margherita.addIngredient(ingredients);

    const  pepperoni = await Pizza.create({
      name: 'Pizza Pepperoni',
      price: 12,
      image: 'https://static.wixstatic.com/media/92be87_bd29ffb7fc444234a7e96133f3b723fc~mv2.jpg/v1/fill/w_828,h_551,al_c,lg_1,q_85,enc_avif,quality_auto/92be87_bd29ffb7fc444234a7e96133f3b723fc~mv2.jpg',
      description: 'A classic Italian pizza with tomato sauce, mozzarella cheese, and pepperoni.'
    });
    await Ingredient.create({
      name: 'Pepperoni',
      price: 1,
      image: 'https://www.seriouseats.com/thmb/A9suq99VfX-1k6enkWlkC_4ypWI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__slice.seriouseats.com__images__2012__12__20121211-pepperoni-curl-pizza-lab-01-6109e17ffa4a487b855011d9f0f1a55d.jpg'
    })
    const additional = await Ingredient.findAll({
      where: {
        name: {
          [Op.in]: ['Tomato', 'Mozzarella', 'Pepperoni']
        }
      }
    })
    await pepperoni.addIngredient(additional);

    const hawaiian = await Pizza.create({
      name: 'Pizza Hawaiian',
      price: 12,
      image: 'https://www.seriouseats.com/thmb/A9suq99VfX-1k6enkWlkC_4ypWI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__slice.seriouseats.com__images__2012__12__20121211-pepperoni-curl-pizza-lab-01-6109e17ffa4a487b855011d9f0f1a55d.jpg',
      description: 'Hawaiian Pizza is a sweet and savory delight, combining juicy pineapple and smoky ham over a golden layer of melted mozzarella atop tangy tomato sauce. Baked on a crisp, chewy crust, each slice delivers a tropical burst of flavor that’s both bold and irresistibly satisfying.'
    });
    await Ingredient.create({
      name: 'Ham',
      price: 1,
      image: 'https://www.rockrecipes.com/wp-content/uploads/2007/12/DSC0148-1-4.jpg'
    })
    const hawaiian_additional = await Ingredient.findAll({
      where: {
        name: {
          [Op.in]: ['Tomato', 'Mozzarella', 'Ham']
        }
      }
    })
    await hawaiian.addIngredient(hawaiian_additional);

    const veggie = await Pizza.create({
      name: 'Pizza Veggie',
      price: 12,
      image: 'https://www.allrecipes.com/thmb/YK6SsTW9wieSVaFP9bwNzhhXgcM=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/AR-15022-veggie-pizza-DDMFS-4x3-hero-3dabf0783ef544eeaa23bdf28b48b178.jpg',
      description: 'Veggie Pizza is a garden-fresh medley of colorful bell peppers, earthy mushrooms, sweet red onions, and ripe tomatoes layered over rich tomato sauce and melted mozzarella. Baked to perfection on a crispy crust, each bite bursts with vibrant, wholesome flavor and satisfying crunch.'
    });
    await Ingredient.create({
      name: 'Mushroom',
      price: 1,
      image: 'https://culinarylore.com/wp-content/uploads/2012/04/cooked-mushrooms-in-pan.jpg.webp'
    })
    const veggie_additional = await Ingredient.findAll({
      where: {
        name: {
          [Op.in]: ['Tomato', 'Mozzarella', 'Mushroom']
        }
      }
    })
    await veggie.addIngredient(veggie_additional);
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
