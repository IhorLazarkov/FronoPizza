import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCart } from "../../store/cart"

export function MyCart() {
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const [cartItems, setCartItems] = useState(cart || [])

    useEffect(() => {
        dispatch(getCart())
    }, [dispatch])

    useEffect(() => {
        setCartItems(cart)
    }, [cart.length])

    return (
        <div>
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
            <button className="primary">Checkout</button>
        </div>
    )
}