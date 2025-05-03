import "./MyFavorites.css"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPizzas } from "../../store/pizzas"
import { getFavorites } from "../../store/favorites"

export default function MyFavoritesPage() {
    const dispatch = useDispatch()

    const [favoritesState, setFavorites] = useState([])

    useEffect(() => {
        dispatch(fetchPizzas()).then((pizzas) => {
            dispatch(getFavorites()).then((favorites) => {
                console.log({ pizzas, favorites });
                const favPizzas = pizzas.filter(p => {
                    return favorites.filter(f => f.id === p.id).length > 0
                })
                setFavorites(favPizzas)
            })
        })
    }, [dispatch])

    return (
        <>
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
                        </div>
                    </div>
                ))
                : <h2>No favorites yet</h2>
            }
        </>
    )
}