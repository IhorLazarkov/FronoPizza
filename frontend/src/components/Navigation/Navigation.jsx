import "./Navigation.css"

import { CiShoppingBasket } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import { clearCart } from "../../store/cart"

import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from "react";

import VoiceHelper from "../VoiceHelper";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

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
    const isHelperShow = useRef(false)
    const [voiceHelperClass, setVoiceHelperClass] = useState("voice_helper_hidden")

    const voiceHelperToggle = () => {
        isHelperShow.current = !isHelperShow.current
        setVoiceHelperClass(isHelperShow.current ? "voice_helper_show" : "voice_helper_hide")
    }

    useEffect(() => {
        setUser(user)
    }, [user])

    return (
        <>
            <nav>
                <ul style={{ fontSize: "1.2rem" }}>
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
            <div style={{
                position: "relative"
            }}>
                <Outlet />
                <VoiceHelper clazzName={voiceHelperClass} />
                <div
                    id="voice_helper_button"
                    style={{
                        alignItems: "center",
                        position: "fixed",
                        bottom: "1.3rem",
                        right: "-0.5rem",
                        zIndex: "3",
                    }}>
                    <a href="#"
                        onClick={voiceHelperToggle}
                        style={{
                            fontSize: "1.8rem",
                            borderRadius: "50%",
                            padding: "0.5rem",
                            margin: "1rem",
                            color: "var(--third-v1)",
                            border: "1px solid var(--third-v1)",
                            backgroundColor: "var(--sub-secondary-v1)",

                        }}>
                        {isHelperShow.current
                            ? <RxCross2 style={{ height: "1.3rem" }} />
                            : <FaMicrophone style={{ widthdth: "1.3rem", height: "1.3rem" }} />}
                    </a>
                </div>
            </div>
            <Tooltip
                anchorSelect="#voice_helper_button"
                defaultIsOpen={true}
                place="left-start"
                style={{
                    width: "clamp(5re, 1rem, 10rem)",
                    fontSize: "1rem",
                }}
            >
                <div style={{
                    position: "relative"
                }}>
                    <p>Add pizza to your cart with voice.</p>
                </div>
            </Tooltip>
        </>
    )
}