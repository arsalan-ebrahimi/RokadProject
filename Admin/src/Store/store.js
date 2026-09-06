// ==========================================
// Redux Store Configuration
// Centralized Redux Toolkit store managing application state
// ==========================================

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";

/**
 * Root Redux store instance.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;