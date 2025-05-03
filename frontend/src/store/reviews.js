const GET_REVIEWS = 'reviews/GET_REVIEWS';

export const getReviews = () => async (dispatch) => {
    const response = await fetch('/api/current/reviews');
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
        default:
            return state;
    }
}

export default reviewsReducer;