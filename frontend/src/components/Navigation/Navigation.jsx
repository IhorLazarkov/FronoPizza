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

    // UI state
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
                }} />
            <CiShoppingBasket />
            <span>{inCard}</span>
        </div>
    )
}

export default function Navigation({ onLogout }) {

    return (
        <>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink>My orders</NavLink></li>
                    <li><Basket /></li>
                    <li><NavLink to="/myfavorites">My faivorites</NavLink></li>
                    <li><NavLink>My reviews</NavLink></li>
                    <li>
                        <button className='critical' onClick={onLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}