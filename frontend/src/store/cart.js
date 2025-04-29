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

export default function cartReducer(state = [], action) {
    switch (action.type) {
        case "ADD_TO_CART":
            const newCart = [...state]
            newCart.push({id: newCart.length+1, pizza: action.payload})
            return [...newCart]
        case "REMOVE_FROM_CART":
            return { ...state, [action.payload.id]: undefined }
        case "CLEAR_CART":
            return []
        default:
            return state
    }
}