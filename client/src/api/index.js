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
 * - If `date` is provided (non-empty) calls /user/workout?date=YYYY-MM-DD
 * - If `date` is empty, calls /user/workout (returns today's workouts)
 */
export const getWorkouts = (date = "") => {
  const params = date ? { date } : {};
  return API.get("/user/workout", { params });
};

export const addWorkout = (data) => API.post("/user/workout", data);
export const updateWorkout = (workoutId, data) => API.put(`/user/workout/${workoutId}`, data);
export const deleteWorkout = (workoutId) => API.delete(`/user/workout/${workoutId}`);

// User Profile
export const getUserProfile = () => API.get("/user/profile");
export const updateUserProfile = (data) => API.put("/user/profile", data);

// Goals
export const createGoal = (data) => API.post("/user/goal", data);
export const getUserGoals = (active) => API.get("/user/goal", { params: { active } });
export const updateGoal = (goalId, data) => API.put(`/user/goal/${goalId}`, data);
export const deleteGoal = (goalId) => API.delete(`/user/goal/${goalId}`);

// Workout Templates
export const createWorkoutTemplate = (data) => API.post("/user/template", data);
export const getWorkoutTemplates = (category) => API.get("/user/template", { params: { category } });
export const deleteWorkoutTemplate = (templateId) => API.delete(`/user/template/${templateId}`);

// Advanced Analytics
export const getAdvancedAnalytics = (period) => API.get("/user/analytics", { params: { period } });

// Search Workouts
export const searchWorkouts = (params) => API.get("/user/workout/search", { params });
