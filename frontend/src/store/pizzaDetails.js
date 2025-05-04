const GET_PIZZA_DETAILS = "pizzaDetails/GET_PIZZA_DETAILS";

export const getPizzaDetails = (id) => async (dispatch) => {
    const response = await fetch(`/api/pizzas/${id}`)
        .catch(async err => {
            const error = new Error('An error occurred while fetching pizza details.');
            error.message = await err.json();
            throw error;
        });

    if (response.ok) {
        const pizzaDetails = await response.json();
        dispatch({
            type: GET_PIZZA_DETAILS,
            payload: pizzaDetails,
        });
        return pizzaDetails;
    }

    return response;
};

const pizzaDetailsReducer = (state = { Ingredients: [], Reviews: [] }, action) => {
    switch (action.type) {
        case GET_PIZZA_DETAILS:
            return action.payload;
        default:
            return state;
    }
};

export default pizzaDetailsReducer;