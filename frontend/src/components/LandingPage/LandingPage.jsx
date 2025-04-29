import './LandingPage.css';

import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { CiShoppingBasket } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../../store/pizzas';
import { addToCart, clearCart } from '../../store/cart';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const dispatch = useDispatch();
  const pizzas = useSelector(state => state.pizzas);
  const cart = useSelector(state => state.cart);
  const [inCard, setInCard] = useState(0);
  const [pizzasState, setPizzas] = useState(pizzas || {});
  const [error, setError] = useState({ message: "", errors: [] });
  const [showBasket, setShowBasket] = useState(false);

  const navigator = useNavigate()

  const goToCart = () => navigator("/mycart")

  const addCartHandler = (pizza) => dispatch(addToCart(pizza))

  useEffect(() => {
    dispatch(fetchPizzas())
      .then(response => setPizzas(response))
      .catch(error => {
        setError({ ...error.message })
      });
  }, [dispatch]);

  useEffect(() => {
    setInCard(() => {
      cart.length > 0 ? setShowBasket(true) : setShowBasket(false)
      return cart.length
    })
  }, [cart.length])

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
      <span>Landing Page</span>
      <section id='pizzas_container'>

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
              onClick={(e) => addCartHandler(pizza)}>Add</button>
          </div>
        ))}
      </section>
      {error && <p>{error.message}</p> && error.errors.map(err => <span key={err}>{err}</span>)}
    </div>
  );
}

export default LandingPage;