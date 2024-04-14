import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const secretKey = process.env.SECRET_KEY;

// Middleware to validate JWT token and attach user ID and role to request object
export const validateJWT = async (req, res, next) => {
  const token = req.header("token");

  try {
    if (!token) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized",
        message: "Access denied. No token provided.",
      });
    }

    const payload = jwt.verify(token, secretKey);

    // Attach user ID to the request object
    req.userId = payload.id;

    // Fetch user from database based on user ID
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized",
        message: "User not found.",
      });
    }

    // Attach user role to the request object
    req.userRole = user.role;

    return next();
  } catch (error) {
    console.error("JWT validation error:", error);
    return res.status(401).json({
      ok: false,
      error: "Unauthorized",
      message: "Token not valid or expired.",
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    return next(); // User is admin, proceed to the next middleware
  } else {
    return res.status(403).json({ message: "Forbidden" }); // User is not authorized
  }
};

// Middleware to check if user is staff
export const isStaff = (req, res, next) => {
  if (req.userRole === "staff" || req.userRole === "admin") {
    return next(); // User is staff or admin, proceed to the next middleware
  } else {
    return res.status(403).json({ message: "Forbidden" }); // User is not authorized
  }
};
