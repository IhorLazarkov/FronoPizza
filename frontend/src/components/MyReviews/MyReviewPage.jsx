import './MyReviews.css';

import { AiOutlineLike } from 'react-icons/ai';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, getReviews, updateReview } from '../../store/reviews';
import { useModal } from '../../context/Modal';

function EditConfirmation({ review }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [rating, setRating] = useState(review.rating);
    const [reviewText, setReviewText] = useState(review.review);

    const onSaveHandler = () => {
        const newReview = {
            ...review,
            rating,
            review: reviewText
        }
        console.log({newReview});
        dispatch(updateReview(newReview))
            .then(closeModal)
            .catch(err => console.log({ err }));
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3>Edit Review</h3>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}></textarea>
            <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button className="primary" onClick={onSaveHandler}>Save</button>
                <button className='secondary' onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

function DeleteConfirmation({ review }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const onDeleteHandler = () => {
        dispatch(deleteReview(review.id))
            .then(closeModal)
            .catch(err => console.log({ err }));
    }

    return (
        <>
            <h3>Delete Review?</h3>
            <button className='secondary' onClick={closeModal}>No</button>
            <button className="critical" onClick={onDeleteHandler}>Yes</button>
        </>
    )
}

function EditButton({ onModalClose, modalComponent }) {

    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    }
    return (
        <CiEdit onClick={onClick} />
    )
}

function DeleteButton({ onModalClose, modalComponent }) {

    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    }
    return (
        <MdOutlineDeleteOutline onClick={onClick} />
    )
}

export default function MyReviewPage() {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews);
    const [reviewsState, setReviewsState] = useState(reviews);

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
        dispatch(getReviews()).then(reviews => {
            setReviewsState(reviews);
        });
    }, [dispatch])

    useEffect(() => {
        setReviewsState(reviews);
    }, [reviews])

    return (
        <div>
            {reviewsState.length > 0
                ? <div className='reviews_container'
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                    {reviewsState.map(review => (
                        <div
                            className='review_card_container'
                            key={review.id}>
                            <div className="info_container">
                                <h3>{review.Pizza.name}</h3>
                                <div>
                                    <span>{printDate(review.updatedAt)}</span>
                                    <span><AiOutlineLike /> {review.rating}</span>
                                </div>
                                <p>{review.review}</p>
                                <div className='review_card_footer'>
                                    <EditButton
                                        modalComponent={<EditConfirmation review={review} />}
                                    />
                                    <DeleteButton
                                        modalComponent={<DeleteConfirmation review={review} />}
                                    />
                                </div>
                            </div>
                            <div className="img_container">
                                <img src={review.Pizza.image} alt="pizza" />
                            </div>
                        </div>
                    ))}
                </div>
                : <h2>You have no reviews yet</h2>}

        </div>
    )
}