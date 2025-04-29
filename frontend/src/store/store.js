import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import sessionReducer from "./session";
import pizzasReducer from "./pizzas";

let enhancer;
if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const reducers = combineReducers({
    user: sessionReducer,
    pizzas: pizzasReducer,
});

const configureStore = (preloadedState) => {
    return createStore(reducers, preloadedState, enhancer);
}
export default configureStore;