// client/src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor: Add Authorization header with JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("getfit-app-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors and token expiration
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem("getfit-app-token");
      
      // Clear Redux state by dispatching logout
      // Note: We'll handle this in App.js with a window event
      window.dispatchEvent(new Event("unauthorized"));
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default API;

// exported helpers
export const UserSignUp = (data) => API.post("/user/signup", data);
export const UserSignIn = (data) => API.post("/user/signin", data);
export const getDashboardDetails = () => API.get("/user/dashboard");

/**
 * getWorkouts(date)
 * - If `date` is provided (non-empty) calls /user/workout/:date
 * - If `date` is empty, calls /user/workout
 */
export const getWorkouts = (date = "") => {
  const safeDate = date ?? "";
  const url = safeDate ? `/user/workout/${encodeURIComponent(safeDate)}` : "/user/workout";
  return API.get(url);
};

export const addWorkout = (data) => API.post("/user/workout", data);
