import { configureStore } from "@reduxjs/toolkit";
import session from "./session";

export const store = configureStore({
    reducer: {
        user: session,
    },
});