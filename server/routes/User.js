import express from 'express';
import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
  updateWorkout,
  deleteWorkout,
  updateUserProfile,
  getUserProfile,
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  createWorkoutTemplate,
  getWorkoutTemplates,
  deleteWorkoutTemplate,
  getAdvancedAnalytics,
  searchWorkouts,
} from '../controllers/User.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Authentication
router.post('/signup', UserRegister);
router.post('/signin', UserLogin);

// User Profile
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

// Dashboard
router.get('/dashboard', verifyToken, getUserDashboard);
router.get('/analytics', verifyToken, getAdvancedAnalytics);

// Workouts
router.get('/workout', verifyToken, getWorkoutsByDate);
router.post('/workout', verifyToken, addWorkout);
router.put('/workout/:workoutId', verifyToken, updateWorkout);
router.delete('/workout/:workoutId', verifyToken, deleteWorkout);
router.get('/workout/search', verifyToken, searchWorkouts);

// Goals
router.post('/goal', verifyToken, createGoal);
router.get('/goal', verifyToken, getUserGoals);
router.put('/goal/:goalId', verifyToken, updateGoal);
router.delete('/goal/:goalId', verifyToken, deleteGoal);

// Workout Templates
router.post('/template', verifyToken, createWorkoutTemplate);
router.get('/template', verifyToken, getWorkoutTemplates);
router.delete('/template/:templateId', verifyToken, deleteWorkoutTemplate);

export default router;
