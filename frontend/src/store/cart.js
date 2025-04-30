import { csrfFetch } from "./csrf"

export const addToCart = (pizza) => ({
    type: "ADD_TO_CART",
    payload: pizza
})
export const removeFromCart = (pizza) => ({
    type: "REMOVE_FROM_CART",
    payload: pizza
})
export const clearCart = () => ({
    type: "CLEAR_CART"
})
export const getCart = () => ({
    type: "GET_CART"
})

export const createOrder = (order) => async (dispatch) => {
    console.log({order});
    const payloadPizzas = []
    const payloadIngredients = []
    const pizzas = order.pizzas || []
    const ingredients = order.ingredients || []

    pizzas.forEach(({pizza}) => {
        console.log({pizza});
        payloadPizzas.push({
            id: pizza.id,
            price: pizza.price
        })
    })
    ingredients.forEach(({ingredient}) => {
        payloadIngredients.push({
            id: ingredient.id,
            price: ingredient.price,
            quantity: ingredient.quantity
        })
    })

    const payload = {
        pizzas: payloadPizzas,
        ingredients: payloadIngredients
    }

    const response = await csrfFetch('/api/orders', {
        method: "POST",
        body: JSON.stringify(payload)
    }).catch(async err => {
        const error = new Error('An error occurred while fetching pizzas.');
        error.message = await err.json();
        throw error;
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(clearCart())
        return data
    }
    return response;
}

export default function cartReducer(state = [], action) {
    switch (action.type) {
        case "ADD_TO_CART":
            const newCart = [...state]
            const pizza = action.payload
            newCart.push({ id: newCart.length + 1, pizza })
            return [...newCart]
        case "REMOVE_FROM_CART":
            return { ...state, [action.payload.id]: undefined }
        case "CLEAR_CART":
            return []
        // Get all
        case "GET_CART":
        default:
            return state
    }
}