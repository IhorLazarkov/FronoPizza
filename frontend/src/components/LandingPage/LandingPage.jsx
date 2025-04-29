import './LandingPage.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../../store/pizzas';

import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";

function LandingPage() {
  const dispatch = useDispatch();
  const pizzas = useSelector(state => state.pizzas);
  const [pizzasState, setPizzas] = useState(pizzas || {});
  const [error, setError] = useState({ message: "", errors: [] });

  useEffect(() => {
    dispatch(fetchPizzas())
      .then(response => setPizzas(response))
      .catch(error => {
        console.error({ err: error });
        setError({ ...error.message })
      });
  }, [dispatch]);

  return (
    <div>
      <span>Landing Page</span>
      <section id='pizzas_container'>

        {pizzasState && Object.values(pizzasState).map(pizza => (
          <div className="pizza_card" key={pizza.id}>
            <h2>{pizza.name}</h2>
            <img src={pizza.image} alt={pizza.name} />

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
            <button className='primary'>Add</button>
          </div>
        ))}
      </section>
      {error && <p>{error.message}</p> && error.errors.map(err => <span key={err}>{err}</span>)}
    </div>
  );
}

export default LandingPage;