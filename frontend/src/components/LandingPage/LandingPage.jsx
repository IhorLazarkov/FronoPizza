import './LandingPage.css';

import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { CiShoppingBasket } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../../store/pizzas';
import { addToCart, clearCart } from '../../store/cart';
import { getIngredients } from '../../store/ingredients';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const pizzas = useSelector(state => state.pizzas);
  const ingredients = useSelector(state => state.ingredients);

  const [inCard, setInCard] = useState(0);
  const [pizzasState, setPizzas] = useState(pizzas || {});
  const [ingredientsState, setIngredients] = useState(ingredients || {});

  const [error, setError] = useState({ message: "", errors: [] });
  const [showBasket, setShowBasket] = useState(false);

  const navigator = useNavigate()
  const goToCart = () => navigator("/mycart")

  const addPizzaCartHandler = (pizza) => dispatch(addToCart(pizza))
  const addIngredientCartHandler = (ingredient) => dispatch(addToCart(ingredient))

  useEffect(() => {

    // Get Pizzas
    dispatch(fetchPizzas())
      .then(response => setPizzas(response))
      .catch(error => setError({ ...error.message }));

    // Get Ingredients
    dispatch(getIngredients())
      .then(response => setIngredients(response))
      .catch(error => setError({ ...error.message }))

  }, [dispatch]);

  useEffect(() => {
    setInCard(() => {
      cart.pizzas.length > 0 ? setShowBasket(true) : setShowBasket(false)
      return cart.pizzas.length + cart.ingredients.length
    })
  }, [cart.pizzas.length || cart.ingredients.length])

  return (
    <div style={{ position: "relative" }}>
      <div
        className={`basket ${showBasket ? "basket-show" : ""}`}
        onClick={goToCart} >

        <IoCloseCircle style={{ fontSize: "1.3rem" }} onClick={(e) => {
          e.stopPropagation()
          dispatch(clearCart())
        }} />
        <CiShoppingBasket />
        {inCard}
      </div>
      <span style={{ position: "absolute" }}>Landing Page</span>

      {/* Pizzas */}
      <section id='pizzas_container'>
        <span className='banner'>Pizzas</span>
        {pizzasState && Object.values(pizzasState).map(pizza => (
          <div className="pizza_card" key={pizza.id}>
            <h2>{pizza.name}</h2>
            <div className="img_container">
              <img src={pizza.image} alt={pizza.name} />
            </div>

            <p>{pizza.description}</p>
            {/* Ingredients */}
            <ul>
              {pizza.ingredients.map(({ id, name }) => (
                <li key={id}>&sect; {name}</li>
              ))}
            </ul>
            {/* Reviews & Price */}
            <div className='pizza_card_footer'>
              {/* Price */}
              <div>Cost: ${pizza.price}</div>
              {/* Reviews */}
              <div>
                {pizza.totalReviews > 0
                  ? <span><MdOutlineMessage /> {pizza.totalReviews}</span>
                  : <span>No reviews</span>}
                <span><AiOutlineLike /> {pizza.avgRating}</span>
              </div>
            </div>
            <button
              className='primary'
              onClick={() => addPizzaCartHandler(pizza)}>Add</button>
          </div>
        ))}
      </section>

      {/* Ingredients */}
      <section id="ingredients_container">
      <span className='banner'>Add-ons</span>
        {ingredientsState && Object.values(ingredientsState).map(ingredient => (
          <div className='ingredient_card' key={ingredient.id}>
            <div className="img_container">
              <img src={ingredient.image} alt={ingredient.name} />
            </div>
            <p>{ingredient.name}</p>
            <div className='pizza_card_footer'>
              <div>Cost: ${ingredient.price}</div>
            </div>
            <button
              className='primary'
              onClick={() => addIngredientCartHandler(ingredient)}>Add</button>
          </div>
        ))}
      </section>

      {/* Error */}
      {error && <p>{error.message}</p> && error.errors.map(err => <span key={err}>{err}</span>)}
    </div>
  );
}

export default LandingPage;