import './LandingPage.css';

import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../../store/pizzas';
import { addIngredientToCart, addPizzaToCart } from '../../store/cart';
import { getIngredients } from '../../store/ingredients';
import { getFavorites, addFavorite, removeFavorite } from '../../store/favorites';
import { NavLink } from 'react-router-dom';

function LandingPage() {

  const dispatch = useDispatch();
  const pizzas = useSelector(state => state.pizzas);
  const ingredients = useSelector(state => state.ingredients);
  const favorites = useSelector(state => state.favorites);

  const [pizzasState, setPizzas] = useState(pizzas || {});
  const [ingredientsState, setIngredients] = useState(ingredients || {});
  const [favoritesState, setFavorites] = useState(favorites || []);

  const [error, setError] = useState({ message: "", errors: [] });

  const addPizzaCartHandler = (pizza) => dispatch(addPizzaToCart(pizza))
  const addIngredientCartHandler = (ingredient) => dispatch(addIngredientToCart(ingredient))

  const isFavorite = (id) => favoritesState.filter(f => f.id === id).length > 0;
  const addFavoriteHandler = (id) => {
    dispatch(addFavorite(id))
      .then(() => {
        dispatch(getFavorites()).then(res => {
          setFavorites(res)
        })
      })
      .catch(error => console.error({ error }))
  }
  const removeFavoriteHandler = (id) => {
    dispatch(removeFavorite(id))
      .then(() => {
        dispatch(getFavorites()).then(res => {
          setFavorites(res)
        })
      })
      .catch(error => console.error({ error }))
  }

  useEffect(() => {

    // Get Pizzas
    dispatch(fetchPizzas())
      .then(response => setPizzas(response))
      .catch(error => setError({ ...error.message }));

    // Get Ingredients
    dispatch(getIngredients())
      .then(response => setIngredients(response))
      .catch(error => setError({ ...error.message }))

    // Get Favorites
    dispatch(getFavorites())
      .then(res => setFavorites(res))
      .catch(error => setError({ ...error.message }))

  }, [dispatch]);


  return (
    <div style={{ position: "relative" }}>

      <span style={{ position: "absolute" }}>Landing Page</span>

      {/* Pizzas */}
      <section id='pizzas_container'>
        <span className='banner'>Pizzas</span>
        {pizzasState && Object.values(pizzasState).map(pizza => (
          <NavLink
            to={`/pizza/${pizza.id}`}
            className="pizza_card"
            key={pizza.id}>
            <h2>{pizza.name}</h2>
            <div className="img_container">
              <img
                src={pizza.image}
                loading='lazy'
                alt={pizza.name} />
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
              {/* Favorites */}
              {favoritesState && isFavorite(pizza.id)
                ? <MdFavoriteBorder
                  style={{ color: "red" }}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavoriteHandler(pizza.id);
                  }}
                />
                : <MdFavoriteBorder
                  onClick={(e) => {
                    e.preventDefault();
                    addFavoriteHandler(pizza.id);
                  }}
                />
              }
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
              onClick={(e) => {
                e.preventDefault();
                addPizzaCartHandler(pizza);
              }}>Add</button>
          </NavLink>
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