import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createError(401, "No auth header - Not authenticated!"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) return next(createError(401, "Token missing!"));

    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;

    next();
  } catch (err) {
    next(err);
  }
};
