import { csrfFetch } from "./csrf";

const GET_PIZZAS = 'pizzas/GET_PIZZAS';

export const fetchPizzas = () => async (dispatch) => {
    const response = await csrfFetch('/api/pizzas/')
        .catch(async error => {
            const err = new Error('An error occurred while fetching pizzas.');
            err.message = await error.json();
            throw err;
        });

    if (response.ok) {
        const pizzas = await response.json();
        dispatch({ type: GET_PIZZAS, pizzas });
        return pizzas;
    }

    return response
};

export default function pizzasReducer(state = {}, action) {
    switch (action.type) {
        case GET_PIZZAS:
            const newState = {};
            action.pizzas.forEach(pizza => {
                newState[pizza.id] = pizza;
            });
            return newState;
        default:
            return state;
    }
}