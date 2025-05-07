import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';

export const addReview = (review) => async (dispatch) => {
    const response = await csrfFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(review)
    }).catch(async error => {
        console.log({ error });
        const err = new Error('Fail to add review.');
        err.message = await error.json();
        throw err;
    })

    if (response.ok) {
        const resReview = await response.json();
        dispatch({
            type: ADD_REVIEW,
            payload: resReview
        })
        return resReview;
    }

    return response;
}

export const deleteReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE'
    }).catch(async error => {
        const err = new Error('Fail to delete review.');
        err.message = await error.json();
        throw err;
    });

    if (response.ok) {
        dispatch({
            type: DELETE_REVIEW,
            id
        })
        return response;
    }
}

export const updateReview = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        body: JSON.stringify(review)
    }).catch(async error => {
        const err = new Error('Fail to update review.');
        err.message = await error.json();
        throw err;
    });
    if (response.ok) {
        const resReview = await response.json();
        dispatch({
            type: UPDATE_REVIEW,
            payload: resReview
        })
        return resReview;
    }
}

export const getReviews = () => async (dispatch) => {
    const response = await csrfFetch('/api/current/reviews');
    const reviews = await response.json();
    dispatch({
        type: GET_REVIEWS,
        reviews
    })
    return reviews;
}

const reviewsReducer = (state = [], action) => {
    switch (action.type) {
        case GET_REVIEWS:
            return action.reviews;
        case ADD_REVIEW:
            return [...state, action.payload];
        case UPDATE_REVIEW: {
            const newStateOnUpdate = [];
            state.forEach(r => {
                if (r.id === action.payload.id) {
                    newStateOnUpdate.push(action.payload);
                } else
                    newStateOnUpdate.push(r);
            })
            return [...newStateOnUpdate]
        }
        case DELETE_REVIEW: {
            const newStateOnDelete = state.filter(review => review.id !== action.id);
            return [...newStateOnDelete];
        }
        default:
            return state;
    }
}

export default reviewsReducer;