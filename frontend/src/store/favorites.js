import { csrfFetch } from "./csrf";

const ADD_FAVORITES = 'favorites/ADD_FAVORITES';
const RECEIVE_FAVORITES = 'favorites/RECEIVE_FAVORITES';
const REMOVE_FAVORITES = 'favorites/REMOVE_FAVORITES';

export const addFavorite = (id) => async (dispatch) => {
    const response = await csrfFetch('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ pizzaId: id })
    }).catch(async err => {
        const error = new Error('An error occurred while adding a favorite.');
        error.message = await err.json();
        throw error;
    });

    if (response.ok) {
        const favorites = await response.json();
        dispatch({ type: ADD_FAVORITES, favorites: { id } });
        return favorites;
    }

    return response;
}

export const removeFavorite = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id })
    }).catch(async err => {
        const error = new Error('An error occurred while removing a favorite.');
        error.message = await err.json();
        throw error;
    });

    if (response.ok) {
        const favorites = await response.json();
        dispatch({ type: REMOVE_FAVORITES, favorites: { id } });
        return favorites;
    }

    return response;
}

export const getFavorites = () => async (dispatch) => {
    const response = await csrfFetch('/api/current/favorites')
        .catch(async error => {
            const err = new Error('An error occurred while fetching favvorites.');;
            err.message = await error.json();
            throw err;
        });

    if (response.ok) {
        const favorites = await response.json();
        dispatch({ type: RECEIVE_FAVORITES, favorites });
        return favorites;
    }

    return response;
}

const favoritesReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_FAVORITES:
            return [...state, action.favorites];
        case RECEIVE_FAVORITES:
            return [...action.favorites];
        case REMOVE_FAVORITES: {
            const newState = state.filter(favorite => favorite.id !== action.favorites.id);
            return [...newState]
        }
        default:
            return state;
    }
}

export default favoritesReducer;