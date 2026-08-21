import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("accessToken");
const user = localStorage.getItem("user");

const initialState = {
    user: user ? JSON.parse(user) : null,
    accessToken: token || null,
    isAuthenticated: !!token,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;

            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
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
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;