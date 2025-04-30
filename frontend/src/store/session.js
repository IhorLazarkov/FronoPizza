import { csrfFetch } from "./csrf.js";

const loginAction = "user/LOGIN"
const logoutAction = "user/LOGOUT"
const restoreAction = "user/RESTORE"
const signupAction = "user/SIGNUP"

/**
 * @description Login a user
 * @param {email, firstName, lastName, password} user 
 * @returns http response
 */
export const login = (user) => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify(user),
    }).catch(async error => await error.json());

    if (response.ok) {
        const data = await response.json();
        dispatch({ type: loginAction, user: data })
        return response;
    }

    return response;
}

/**
 * @description Signup a user
 * @param {email, firstName, lastName, password} user 
 * @returns http response
 */
export const signup = (user) => async (dispatch) => {
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            password: user.password
        }),
    }).catch(async error => await error.json());

    if (response.ok) {
        const data = await response.json();
        dispatch({ type: signupAction, user: data })
        return response;
    }

    return response;
}

export const logout = () => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "DELETE",
    }).catch(async error => await error.json())

    if (response.ok) {
        const data = await response.json();
        dispatch({ type: logoutAction, user: {} });
        return data;
    }

    return response;
}

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session")
        .catch(async error => await error.json())

    if (response.ok) {
        const data = await response.json();
        dispatch({ type: restoreAction, user: data });
        return response;
    }

    return response;
}

export default function sessionReducer(state = {}, action) {
    switch (action.type) {
        case loginAction:
            return { ...action.user };
        case logoutAction:
            return action.user;
        case restoreAction:
            return action.user;
        default:
            return state;
    }
}