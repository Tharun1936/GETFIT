// client/src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  // withCredentials: true // enable if you use cookie auth
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("getfit-app-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("getfit-app-token");
      // optionally: window.location = "/login";
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
