import { csrfFetch } from "./csrf"

export const addPizzaToCart = (pizza) => ({
    type: "ADD_PIZZA_TO_CART",
    payload: pizza
})
export const addIngredientToCart = (ingredient) => ({
    type: "ADD_INGREDIENT_TO_CART",
    payload: ingredient
})
export const removeFromCart = (pizza) => ({
    type: "REMOVE_PIZZA_FROM_CART",
    payload: pizza
})
export const removeIngredientFromCart = (ingredient) => ({
    type: "REMOOVE_INGREDIENT_FROM_CART",
    payload: ingredient
})
export const clearCart = () => ({
    type: "CLEAR_CART"
})
export const getCart = () => ({
    type: "GET_CART"
})

export const createOrder = (order) => async (dispatch) => {
    const payloadPizzas = []
    const payloadIngredients = []
    const pizzas = order.pizzas || []
    const ingredients = order.ingredients || []

    pizzas.forEach(({ pizza }) => {
        payloadPizzas.push({
            id: pizza.id,
            price: pizza.price
        })
    })
    ingredients.forEach(({ ingredient }) => {
        payloadIngredients.push({
            id: ingredient.id,
            price: ingredient.price
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

const initialState = {
    pizzas: [],
    ingredients: []
}

export default function cartReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_PIZZA_TO_CART": {
            const pizzas = [...state.pizzas]
            const newPizza = action.payload
            pizzas.push({ id: pizzas.length + 1, pizza: newPizza })
            const newState = { ...state, pizzas }
            return newState
        }
        case "ADD_INGREDIENT_TO_CART": {
            const ingredients = [...state.ingredients]
            const newIngredient = action.payload
            ingredients.push({ id: ingredients.length + 1, ingredient: newIngredient })
            const newStateIngredient = { ...state, ingredients }
            return newStateIngredient
        }
        case "REMOVE_PIZZA_FROM_CART": {
            const pizzasBeforeRemove = [...state.pizzas]
            const { id } = action.payload
            const newStateRemove = pizzasBeforeRemove.filter(pizza => pizza.id !== id)
            return { ...state, pizzas: newStateRemove }
        }
        case "REMOOVE_INGREDIENT_FROM_CART": {
            const ingredientsBeforeRemove = [...state.ingredients]
            const { id: idIngredient } = action.payload
            const newStateRemoveIngredient = ingredientsBeforeRemove.filter(ingredient => ingredient.id !== idIngredient)
            return { ...state, ingredients: newStateRemoveIngredient }
        }
        case "CLEAR_CART":
            return initialState
        // Get all
        case "GET_CART":
        default:
            return state
    }
}