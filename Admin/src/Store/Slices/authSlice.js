// ==========================================
// Redux Slice: Authentication State
// Manages JWT token storage and synchronization with localStorage
// ==========================================

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Stores token in Redux state and localStorage
    login: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    // Clears token and all localStorage items upon logout
    logout: (state) => {
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;