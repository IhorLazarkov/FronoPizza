import "./MyCart.css"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createOrder, getCart, removeFromCart, removeIngredientFromCart } from "../../store/cart"
import { useNavigate } from 'react-router-dom';

export default function MyCart() {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const [cartItems, setCartItems] = useState(cart)
    const [isEnableCheckout, setIsEnableCheckout] = useState(false)
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

    // Remove pizza from cart
    const removePizza = (pizza) => {
        dispatch(removeFromCart(pizza))
    }

    // Remove ingredient from cart
    const removeIngredient = (ingredient) => {
        dispatch(removeIngredientFromCart(ingredient))
    }

    useEffect(() => {
        dispatch(getCart())
    }, [dispatch])

    useEffect(() => {
        let totalPrice = cart.pizzas.reduce((acc, { pizza }) => acc + pizza.price, 0)
        totalPrice += cart.ingredients.reduce((acc, { ingredient }) => acc + ingredient.price, 0)
        setTotalPrice(totalPrice)
        if (totalPrice > 0) setIsEnableCheckout(true)
        else setIsEnableCheckout(false)
    }, [cartItems.pizzas.length + cartItems.ingredients.length])

    useEffect(() => {
        setCartItems(cart)
    }, [cart])

    return (
        <div className="mycart_container">
            {cartItems.pizzas.length > 0 &&
                <h3 style={{
                    backgroundColor: "skyblue",
                    margin: "0",
                    marginBottom: "1rem",
                    padding: "10px",
                    opacity: "0.8",
                }}>
                    Pizzas
                </h3>
            }
            {cartItems.pizzas.map((item) => (
                <div key={item.id} className="mycart_item">
                    <div className="img_container">
                        <img src={`${item.pizza.image}`} alt={`${item.pizza.name}`} />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}>
                        <h3>{item.pizza.name}</h3>
                        <p>{item.pizza.description}</p>
                        <div>Cost: ${item.pizza.price}</div>
                        <button
                            className="critical"
                            style={{
                                width: "fit-content",
                                fontSize: "1.2rem",
                                marginLeft: "1rem"
                            }}
                            onClick={() => removePizza(item)}
                        >Revome from cart</button>
                    </div>
                </div>
            ))}
            {cartItems.ingredients.length > 0 &&
                <h3 style={{
                    backgroundColor: "skyblue",
                    opacity: "0.8",
                    margin: "0",
                    padding: "10px",
                }}>
                    Add-ons
                </h3>
            }
            {cartItems.ingredients.map((item) => (
                <div key={item.id} className="mycart_item">
                    <div className="img_container">
                        <img src={`${item.ingredient.image}`} alt={`${item.ingredient.name}`} />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}>
                        <div>{item.ingredient.name}</div>
                        <div>Cost: ${item.ingredient.price}</div>
                        <button
                            className="critical"
                            style={{
                                width: "fit-content",
                                fontSize: "1.2rem",
                                marginLeft: "1rem"
                            }}
                            onClick={() => removeIngredient(item)}
                        >Revome from cart</button>
                    </div>
                </div>
            ))}
            <div className="mycart_footer">
                {isEnableCheckout && <div style={{
                    backgroundColor: "var(--third-v1)",
                    color: "var(--sub-secondary-v1)",
                    fontFamily: "var(--description-font)",
                    padding: "10px",
                }}>Total: ${totalPrice}
                </div>
                }
                <div style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                }}>
                    <button className="critical" onClick={continueHandler}>Back to Shopping</button>
                    {isEnableCheckout && <button className="primary" onClick={checkOutHandler}>Checkout</button>}
                </div>
                <div style={{ color: "red", borderColor: "red", fontSize: "1.5rem" }}>{error.message}</div>
            </div>
        </div>
    )
}