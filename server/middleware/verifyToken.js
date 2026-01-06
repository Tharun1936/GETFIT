import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createError(401, "No auth header - Not authenticated!"));
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Invalid authorization header format!"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createError(401, "Token missing!"));
    }

    // Verify JWT token
    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;

    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token!"));
    }
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Token expired!"));
    }
    return next(createError(401, "Authentication failed!"));
  }
};
