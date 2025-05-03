import "./PizzaDetails.css";
import { AiOutlineLike } from "react-icons/ai";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPizzaDetails } from "../../store/pizzaDetails";

export default function PizzaDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const pizza = useSelector(state => state.pizzaDetails);
    const [pizzaState, setPizzaState] = useState(pizza);
    const isReviewOwner = useRef(false);
    const numReviews = useRef(0);

    const arrMonth = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];
    const printDate = (date) => {
        const dateObj = new Date(date);
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        return `${arrMonth[month]} ${day} ${year}`;
    }

    useEffect(() => {
        dispatch(getPizzaDetails(id))
            .then(pizzaDetails => {
                const { id } = user;
                isReviewOwner.current = pizzaDetails.Reviews.filter(({ User }) => User.id === id).length > 0
                numReviews.current = pizzaDetails.Reviews.length
                setPizzaState(pizzaDetails)
            })
            .catch(error => console.error({ error }));
    }, [dispatch]);

    return (
        <div className="pizza_details_page">
            <div className="img_container">
                <img src={`${pizzaState.image}`} alt={`${pizzaState.name}`} />
                <div className="info" >
                    <h1>{pizzaState.name}</h1>
                    <p>{pizzaState.description}</p>
                    <div style={{ fontSize: "1.5rem" }}>Cost: ${pizzaState.price}</div>
                </div>
            </div>
            <section className="ingredients">
                {pizzaState.Ingredients.map(i => (
                    <div key={i.id} className="ingredient">
                        <div className="img_container">
                            <h3>{i.name}</h3>
                            <img src={`${i.image}`} alt={`${i.nanme}`} />
                        </div>
                    </div>
                ))}
            </section>
            <section className="reviews">
                {numReviews.current == 0
                    ? <h3>There are no reviews yet</h3>
                    : <h3>Reveiws: {numReviews.current}</h3>}
                {!isReviewOwner.current && <button
                    style={{ width: "max-content", padding: "10px", fontSize: "1rem" }}
                    className="primary">Add Review</button>}
                {pizzaState.Reviews.map(r => (
                    <div key={r.id} className="review">
                        <span>{printDate(r.updatedAt)}</span>
                        <p>{r.review}</p>
                        <div style={{
                            display: "flex",
                            gap: "10px",
                            alignContent: "flex-end"
                        }}>
                            <span>{r.User.firstName}</span>
                            <span>{r.User.lastName}</span>
                            <span style={{ textAlign: "end" }}>
                                <AiOutlineLike />{r.rating}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}