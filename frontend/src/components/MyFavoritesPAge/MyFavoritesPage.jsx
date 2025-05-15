import "./MyFavorites.css"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchPizzas } from "../../store/pizzas"
import { getFavorites } from "../../store/favorites"
import { addPizzaToCart } from "../../store/cart"

export default function MyFavoritesPage() {
    const dispatch = useDispatch()

    const [favoritesState, setFavorites] = useState([])

    const addToCart = (pizza) => {
        dispatch(addPizzaToCart(pizza))
    }
    useEffect(() => {
        dispatch(fetchPizzas()).then((pizzas) => {
            dispatch(getFavorites()).then((favorites) => {
                const favPizzas = pizzas.filter(p => {
                    return favorites.filter(f => f.id === p.id).length > 0
                })
                setFavorites(favPizzas)
            })
        })
    }, [dispatch])

    return (
        <div>
            {favoritesState.length > 0
                ? favoritesState.map(pizza => (
                    <div className="fav_card_container"
                        key={pizza.id}>
                        <div className="img_container">
                            <img src={pizza.image} alt={pizza.name} />
                        </div>
                        <div className="info_container">

                            <h2>{pizza.name}</h2>
                            <p>{pizza.description}</p>
                            <ul>
                                {pizza.ingredients.map(i => (
                                    <li key={i.id}>{i.name}</li>
                                ))}
                            </ul>
                            <button
                                className="primary"
                                style={{
                                    fontSize: "1rem",
                                    width: "fit-content",
                                    transform: "rotate(0deg)",
                                    opacity: "1"
                                }}
                                onClick={() => addToCart(pizza)}
                            >Add to cart</button>
                        </div>
                    </div>
                ))
                : <h2>No favorites yet</h2>
            }
        </div>
    )
}