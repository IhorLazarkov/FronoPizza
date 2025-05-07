import { csrfFetch } from "./csrf"

const GET_ORDERS = 'orders/GET_ORDERS'

const initialState = [{ OrderItems: [] }]

export const getOrders = () => async (dispatch) => {
    const response = await csrfFetch('/api/current/orders')
    const orders = await response.json()
    dispatch({
        type: GET_ORDERS,
        payload: orders
    })
    return orders
}

export default function ordersReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ORDERS:
            return action.payload
        default:
            return state
    }
}