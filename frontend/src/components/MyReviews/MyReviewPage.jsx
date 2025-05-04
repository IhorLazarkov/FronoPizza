import './MyReviews.css';

import { AiOutlineLike } from 'react-icons/ai';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../../store/reviews';

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
                                    <CiEdit />
                                    <MdOutlineDeleteOutline />
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