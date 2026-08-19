import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem("accessToken");
const user = localStorage.getItem("user");

const initialState = {
    user: user ? JSON.parse(user) : null,
    accessToken: accessToken || null,
    isAuthenticated: !!accessToken,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {

        loginSuccess: (state, action) => {

            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;

            localStorage.setItem(
                "accessToken",
                action.payload.accessToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );
        },

        logout: (state) => {

            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        },

        setUser: (state, action) => {
            state.user = action.payload;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        },

    },
});

export const {
    loginSuccess,
    logout,
    setUser,
} = authSlice.actions;

export default authSlice.reducer;