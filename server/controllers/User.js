import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Goal from "../models/Goal.js";
import WorkoutTemplate from "../models/WorkoutTemplate.js";
import Goal from "../models/Goal.js";
import WorkoutTemplate from "../models/WorkoutTemplate.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    // Calculate start date for weekly data (7 days ago)
    const startWeek = new Date(
      currentDateFormatted.getTime() - 6 * 24 * 60 * 60 * 1000
    );
    const startWeekFormatted = new Date(
      startWeek.getFullYear(),
      startWeek.getMonth(),
      startWeek.getDate()
    );

    // OPTIMIZED: Single aggregation pipeline for today's data (calories, workouts, categories)
    const todayDataPipeline = [
      {
        $match: {
          user: user._id,
          date: { $gte: startToday, $lt: endToday },
        },
      },
      {
        $facet: {
          totalCalories: [
            {
              $group: {
                _id: null,
                totalCaloriesBurnt: { $sum: "$caloriesBurned" },
              },
            },
          ],
          totalWorkouts: [{ $count: "count" }],
          categoryCalories: [
            {
              $group: {
                _id: "$category",
                totalCaloriesBurnt: { $sum: "$caloriesBurned" },
              },
            },
          ],
        },
      },
    ];

    // OPTIMIZED: Single aggregation for weekly data (replaces 7 separate queries)
    const weeklyDataPipeline = [
      {
        $match: {
          user: user._id,
          date: { $gte: startWeekFormatted, $lt: endToday },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    // Execute queries in parallel for better performance
    const [todayDataResult, weeklyDataResult] = await Promise.all([
      Workout.aggregate(todayDataPipeline),
      Workout.aggregate(weeklyDataPipeline),
    ]);

    // Extract today's data
    const todayData = todayDataResult[0] || {};
    const totalCaloriesBurnt =
      todayData.totalCalories?.[0]?.totalCaloriesBurnt || 0;
    const totalWorkouts = todayData.totalWorkouts?.[0]?.count || 0;
    const avgCaloriesBurntPerWorkout =
      totalWorkouts > 0 ? totalCaloriesBurnt / totalWorkouts : 0;

    // Format category data for pie chart
    const categoryCalories = todayData.categoryCalories || [];
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    // Process weekly data - create map for quick lookup
    const weeklyMap = new Map();
    weeklyDataResult.forEach((day) => {
      weeklyMap.set(day._id, day.totalCaloriesBurnt);
    });

    // Generate weeks array and match with calories
    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      weeks.push(`${date.getDate()}th`);
      caloriesBurnt.push(weeklyMap.get(dateStr) || 0);
    }

    return res.status(200).json({
      totalCaloriesBurnt,
      totalWorkouts,
      avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Parse date from query parameter (YYYY-MM-DD format) or use today
    let date;
    if (req.query.date) {
      // Handle YYYY-MM-DD format
      const dateStr = req.query.date;
      const [year, month, day] = dateStr.split("-").map(Number);
      if (year && month && day) {
        date = new Date(year, month - 1, day); // month is 0-indexed
      } else {
        date = new Date(req.query.date);
      }
    } else {
      date = new Date();
    }

    // Validate date
    if (isNaN(date.getTime())) {
      return next(createError(400, "Invalid date format"));
    }

    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + (workout.caloriesBurned || 0),
      0
    );

    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) {
      return next(createError(400, "Workout string is missing"));
    }
    // Split workoutString into lines (handle both newline and semicolon separators)
    const lines = workoutString.split(/\n/).map((line) => line.trim()).filter(line => line.length > 0);
    
    // Check if any workouts start with "#" to indicate categories
    const categories = lines.filter((line) => line.startsWith("#"));
    if (categories.length === 0) {
      return next(createError(400, "No categories found in workout string. Please start with #Category"));
    }

    const parsedWorkouts = [];
    let currentCategory = "";
    let currentWorkoutLines = [];

    // Parse the workout string line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith("#")) {
        // If we have a previous workout to process, parse it first
        if (currentWorkoutLines.length > 0 && currentCategory) {
          const workoutDetails = parseWorkoutLine(currentWorkoutLines);
          if (workoutDetails) {
            workoutDetails.category = currentCategory;
            parsedWorkouts.push(workoutDetails);
          }
          currentWorkoutLines = [];
        }
        
        // Start new workout with category
        currentCategory = line.substring(1).trim();
        currentWorkoutLines = [line]; // Include category line
      } else if (line.startsWith("-") && currentCategory) {
        // Add workout detail line
        currentWorkoutLines.push(line);
      } else if (line.trim().length > 0) {
        // Invalid line format
        return next(createError(400, `Invalid format at line: ${line}. Lines should start with # for category or - for details.`));
      }
    }

    // Parse the last workout if any
    if (currentWorkoutLines.length > 0 && currentCategory) {
      const workoutDetails = parseWorkoutLine(currentWorkoutLines);
      if (workoutDetails == null) {
        return next(createError(400, "Please enter in proper format. Expected: #Category, -Workout Name, -Sets X Reps, -Weight kg, -Duration min"));
      }
      if (workoutDetails) {
        workoutDetails.category = currentCategory;
        parsedWorkouts.push(workoutDetails);
      }
    }

    if (parsedWorkouts.length === 0) {
      return next(createError(400, "No valid workouts found. Please check the format."));
    }

    // Calculate calories burnt for each workout and save them
    const workoutPromises = parsedWorkouts.map(async (workout) => {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      return Workout.create({ ...workout, user: userId });
    });
    
    await Promise.all(workoutPromises);

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: parsedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    // Use WorkoutName to match the schema (capital W, capital N)
    details.WorkoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};

// Edit workout
export const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutId } = req.params;
    const updateData = req.body;

    const workout = await Workout.findOne({ _id: workoutId, user: userId });
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    // Recalculate calories if workout details changed
    if (updateData.duration || updateData.weight) {
      const workoutDetails = {
        duration: updateData.duration || workout.duration,
        weight: updateData.weight || workout.weight,
      };
      updateData.caloriesBurned = parseFloat(calculateCaloriesBurnt(workoutDetails));
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      { ...updateData, user: userId },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (err) {
    next(err);
  }
};

// Delete workout
export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutId } = req.params;

    const workout = await Workout.findOne({ _id: workoutId, user: userId });
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    await Workout.findByIdAndDelete(workoutId);

    return res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { name, email, img, age } = req.body;

    // Check if email is being changed and if it's already in use
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return next(createError(409, "Email is already in use"));
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (img !== undefined) updateData.img = img;
    if (age !== undefined) updateData.age = age;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// Create goal
export const createGoal = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { type, targetCalories, targetWorkouts, startDate, endDate } = req.body;

    if (!type || !startDate || !endDate) {
      return next(createError(400, "Type, start date, and end date are required"));
    }

    const goal = new Goal({
      user: userId,
      type,
      targetCalories: targetCalories || 0,
      targetWorkouts: targetWorkouts || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
    });

    const savedGoal = await goal.save();
    return res.status(201).json({
      message: "Goal created successfully",
      goal: savedGoal,
    });
  } catch (err) {
    next(err);
  }
};

// Get user goals
export const getUserGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { active } = req.query;

    const query = { user: userId };
    if (active === "true") {
      query.isActive = true;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    // Calculate progress for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        const now = new Date();

        // Get actual progress
        const workouts = await Workout.find({
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        });

        const actualCalories = workouts.reduce(
          (sum, w) => sum + (w.caloriesBurned || 0),
          0
        );
        const actualWorkouts = workouts.length;

        const caloriesProgress =
          goal.targetCalories > 0
            ? Math.min((actualCalories / goal.targetCalories) * 100, 100)
            : 0;
        const workoutsProgress =
          goal.targetWorkouts > 0
            ? Math.min((actualWorkouts / goal.targetWorkouts) * 100, 100)
            : 0;

        return {
          ...goal.toObject(),
          progress: {
            calories: {
              actual: actualCalories,
              target: goal.targetCalories,
              percentage: caloriesProgress,
            },
            workouts: {
              actual: actualWorkouts,
              target: goal.targetWorkouts,
              percentage: workoutsProgress,
            },
          },
        };
      })
    );

    return res.status(200).json({ goals: goalsWithProgress });
  } catch (err) {
    next(err);
  }
};

// Update goal
export const updateGoal = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { goalId } = req.params;
    const updateData = req.body;

    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      return next(createError(404, "Goal not found"));
    }

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (err) {
    next(err);
  }
};

// Delete goal
export const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { goalId } = req.params;

    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      return next(createError(404, "Goal not found"));
    }

    await Goal.findByIdAndDelete(goalId);

    return res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Create workout template
export const createWorkoutTemplate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { name, description, category, workoutName, sets, reps, weight, duration, isDefault } = req.body;

    if (!name || !category || !workoutName) {
      return next(createError(400, "Name, category, and workout name are required"));
    }

    const template = new WorkoutTemplate({
      user: userId,
      name,
      description: description || "",
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      isDefault: isDefault || false,
    });

    const savedTemplate = await template.save();
    return res.status(201).json({
      message: "Workout template created successfully",
      template: savedTemplate,
    });
  } catch (err) {
    next(err);
  }
};

// Get workout templates
export const getWorkoutTemplates = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { category } = req.query;

    const query = { user: userId };
    if (category) {
      query.category = category;
    }

    const templates = await WorkoutTemplate.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ templates });
  } catch (err) {
    next(err);
  }
};

// Delete workout template
export const deleteWorkoutTemplate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { templateId } = req.params;

    const template = await WorkoutTemplate.findOne({ _id: templateId, user: userId });
    if (!template) {
      return next(createError(404, "Template not found"));
    }

    await WorkoutTemplate.findByIdAndDelete(templateId);

    return res.status(200).json({
      message: "Template deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Advanced analytics - Monthly/Yearly data
export const getAdvancedAnalytics = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { period = "monthly" } = req.query; // monthly or yearly

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const now = new Date();
    let startDate, endDate, groupFormat;

    if (period === "yearly") {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      groupFormat = "%Y-%m"; // Group by month
    } else {
      // Monthly - last 12 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      groupFormat = "%Y-%m"; // Group by month
    }

    const analytics = await Workout.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$date" } },
          totalCalories: { $sum: "$caloriesBurned" },
          totalWorkouts: { $sum: 1 },
          avgCaloriesPerWorkout: { $avg: "$caloriesBurned" },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Calculate personal records
    const personalRecords = await Workout.aggregate([
      {
        $match: {
          user: user._id,
        },
      },
      {
        $group: {
          _id: "$WorkoutName",
          maxWeight: { $max: "$weight" },
          maxReps: { $max: "$reps" },
          maxSets: { $max: "$sets" },
          maxCalories: { $max: "$caloriesBurned" },
        },
      },
    ]);

    return res.status(200).json({
      analytics,
      personalRecords,
      period,
    });
  } catch (err) {
    next(err);
  }
};

// Search and filter workouts
export const searchWorkouts = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const {
      search,
      category,
      startDate,
      endDate,
      minCalories,
      maxCalories,
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const query = { user: userId };

    // Search by workout name
    if (search) {
      query.WorkoutName = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by calories range
    if (minCalories || maxCalories) {
      query.caloriesBurned = {};
      if (minCalories) query.caloriesBurned.$gte = parseFloat(minCalories);
      if (maxCalories) query.caloriesBurned.$lte = parseFloat(maxCalories);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workouts = await Workout.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Workout.countDocuments(query);

    return res.status(200).json({
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};