import "./PizzaDetails.css";
import { AiOutlineLike } from "react-icons/ai";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { getPizzaDetails } from "../../store/pizzaDetails";
import { addReview } from "../../store/reviews";
import { addPizzaToCart } from "../../store/cart";
import ModalButton from "../ModalButton";
import ReviewStars from "../ReviewStars";

function ReviewForm({ pizza_id }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const [reviewMessage, setReviewMessage] = useState("");
    const [rating, setRating] = useState(1);
    const [error, setError] = useState("");

    const onAddReview = () => {
        const review = {
            pizza_id,
            user_id: user.id,
            rating,
            review: reviewMessage
        }
        dispatch(addReview(review))
            .then(() => closeModal())
            .catch(err => setError(err.message.errors[0]));
    }

    return (
        <div style={{
            borderBlock: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        }}>
            <h3
                style={{
                    margin: "0",
                    paddingTop: "10%",
                    backgroundColor: "var(--primary-v1)",
                    height: "5rem",
                    color: "var(--sub-secondary-v1)",
                    fontFamily: "var(--header-font)",
                }}>Add Review</h3>
            <textarea
                style={{
                    width: "clamp(20rem, 1rem, 30vw)",
                    fontSize: "0.9rem",
                    position: "relative"
                }}
                rows={5}
                value={reviewMessage}
                onChange={e => setReviewMessage(e.target.value)}
            ></textarea>
            <ReviewStars rating={rating} setRating={setRating} />
            <div style={{ display: "flex", justifyContent: "space-evenly", paddingBottom: "1rem" }}>
                <button className="primary" onClick={onAddReview}>Create</button>
                <button className="critical" onClick={closeModal}>Cancel</button>
            </div>
            {error != "" && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default function PizzaDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const pizza = useSelector(state => state.pizzaDetails);
    const reviews = useSelector(state => state.reviews);
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

    const addToCart = (pizza) => {
        dispatch(addPizzaToCart(pizza))
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
    }, [dispatch, reviews]);

    return (
        <div className="pizza_details_page">
            <div className="img_container">
                <img src={`${pizzaState.image}`} alt={`${pizzaState.name}`} />
                <div className="info" >
                    <h1>{pizzaState.name}</h1>
                    <p>{pizzaState.description}</p>
                    <div>Cost: ${pizzaState.price}</div>
                    <button
                        className="primary"
                        style={{
                            fontSize: "1rem",
                            width: "fit-content",
                            transform: "rotate(0deg)"
                        }}
                        onClick={() => addToCart(pizzaState)}
                    >Add to cart</button>
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
                {!isReviewOwner.current && <ModalButton
                    className="primary"
                    buttonText="Add Review"
                    modalComponent={<ReviewForm pizza_id={pizzaState.id} />}
                />}
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