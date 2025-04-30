import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createOrder, getCart } from "../../store/cart"
import { useNavigate } from 'react-router-dom';

export function MyCart() {
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const [cartItems, setCartItems] = useState(cart || [])
    const [error, setError] = useState({})

    const navigator = useNavigate()
    // Checkout
    const checkOutHandler = () => {
        dispatch(createOrder({
            pizzas: cartItems,
            ingredients: []
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
    }, [cart.length])

    return (
        <div>
            <span>My Cart page</span>
            {cartItems.map((item) => (
                <div key={item.id}>
                    <div>Name: {item.pizza.name}</div>
                    <div>Cost: {item.pizza.price}</div>
                </div>
            ))
            }
            <div>
                Total: {cartItems.reduce((acc, cur) => acc + cur.pizza.price, 0)}
            </div>
            <button className="primary" onClick={checkOutHandler}>Checkout</button>
            <button className="critical" onClick={continueHandler}>Back to Shopping</button>
            <div style={{color:"red", borderColor:"red", fontSize:"1.5rem"}}>{error.message}</div>
        </div>
    )
}