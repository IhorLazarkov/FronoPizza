import "./Navigation.css"

import { CiShoppingBasket } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import { clearCart } from "../../store/cart"

import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";

function Basket() {

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart);

    const navigator = useNavigate()
    const goToCart = () => navigator("/mycart")

    const [inCard, setInCard] = useState(0);

    useEffect(() => {
        setInCard(() => {
            return cart.pizzas.length + cart.ingredients.length
        })
    }, [cart.pizzas.length + cart.ingredients.length])

    return (
        <div
            className={`basket`}
            onClick={goToCart} >

            <IoCloseCircle
                style={{ fontSize: "1.3rem" }}
                onClick={(e) => {
                    e.stopPropagation()
                    dispatch(clearCart())
                }}
            />
            <CiShoppingBasket />
            <span>{inCard}</span>
        </div>
    )
}

export default function Navigation({ onLogout }) {

    const user = useSelector(state => state.user)
    const [userState, setUser] = useState(user)

    useEffect(() => {
        setUser(user)
    }, [user])

    return (
        <>
            <nav>
                <ul>
                    <li><i>Hi</i>, {user.firstName} {userState.lastName}</li>
                    <li><NavLink to="/">Menu</NavLink></li>
                    <li><NavLink to="/myorders">My orders</NavLink></li>
                    <li><Basket /></li>
                    <li><NavLink to="/myfavorites">My faivorites</NavLink></li>
                    <li><NavLink to="/myreviews">My reviews</NavLink></li>
                    <li>
                        <button className='critical' onClick={onLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}