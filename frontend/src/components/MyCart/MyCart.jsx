import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createOrder, getCart } from "../../store/cart"
import { useNavigate } from 'react-router-dom';

export default function MyCart() {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const [cartItems, setCartItems] = useState(cart || {pizzas: [], ingredients: []})
    const [error, setError] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)

    const navigator = useNavigate()
    // Checkout
    const checkOutHandler = () => {
        dispatch(createOrder({
            pizzas: cartItems.pizzas,
            ingredients: cartItems.ingredients
        })).then(res => {
            navigator(`/orderlive/${res.order_id}`)
        }).catch(err => {
            setError(err.message);
        })
    }
    // Go back to shopping
    const continueHandler = () => navigator("/")

    useEffect(() => {
        dispatch(getCart())
    }, [dispatch])

    useEffect(() => {
        setCartItems(cart)
        let totalPrice = cart.pizzas.reduce((acc, {pizza}) => acc + pizza.price, 0)
        totalPrice += cart.ingredients.reduce((acc, {ingredient}) => acc + ingredient.price, 0)
        setTotalPrice(totalPrice)
    }, [cartItems.pizzas.length + cartItems.ingredients.length])

    return (
        <div style={{position:"relative"}}>
            <span style={{position:"absolute"}}>My Cart page</span>
            {cartItems.pizzas.map((item) => (
                <div key={item.id}>
                    <div>Name: {item.pizza.name}</div>
                    <div>Cost: {item.pizza.price}</div>
                </div>
            ))}
            {cartItems.ingredients.map((item) => (
                <div key={item.id}>
                    <div>Name: {item.ingredient.name}</div>
                    <div>Cost: {item.ingredient.price}</div>
                </div>
            ))}
            <div>
                Total: {totalPrice}
            </div>
            <button className="primary" onClick={checkOutHandler}>Checkout</button>
            <button className="critical" onClick={continueHandler}>Back to Shopping</button>
            <div style={{color:"red", borderColor:"red", fontSize:"1.5rem"}}>{error.message}</div>
        </div>
    )
}