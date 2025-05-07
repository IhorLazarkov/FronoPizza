import { csrfFetch } from "./csrf";

const GET_INGREDIENTS = "GET_INGREDIENTS";

export const getIngredients = () => async (dispatch) => {
    const response = await csrfFetch("/api/ingredients")
        .catch(async err => {
            const error = await err.json()
            return response.json(error)
        })

    if (response.ok) {
        const ingredients = await response.json()
        dispatch({
            type: GET_INGREDIENTS,
            ingredients
        })
        return ingredients;
    }

    return response;
}

export default function ingedientsReducer(state = {}, action) {
    switch (action.type) {
        case GET_INGREDIENTS: {
            const newState = {}
            action.ingredients.forEach(ingredient => {
                newState[ingredient.id] = ingredient
            })
            return newState
        }
        default:
            return state
    }
}