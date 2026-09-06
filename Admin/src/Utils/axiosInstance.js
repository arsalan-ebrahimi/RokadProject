// ==========================================
// Utility: Axios HTTP Client Instance
// Configures base URL, auth token injection, and response/error interceptors
// ==========================================

import axios from "axios";

/**
 * Pre-configured Axios instance for API requests.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Attach JWT Bearer token from localStorage to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap response data and format uniform error messages
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "خطا در برقراری ارتباط با سرور";
    const customError = new Error(message);
    customError.response = error.response;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default axiosInstance;

