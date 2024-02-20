import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

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

    req.id = payload.id;
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

export default validateJWT;
