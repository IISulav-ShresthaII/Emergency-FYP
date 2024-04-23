// Importing required packages
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Importing route files
import userRoutes from "./routes/userRoutes.js";
import ItemRoutes from "./routes/ItemRoutes.js";
import SuppliesRoutes from "./routes/SuppliesRoutes.js";
import ManualRoutes from "./routes/ManualRoutes.js";
import PreparednessRoutes from "./routes/PreparednessRoutes.js";

// Creating an instance of Express app
const app = express();

// Loading environment variables from .env file
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for enabling CORS
app.use(cors());

// Middleware for HTTP request logging
app.use(morgan("dev"));

// Middleware to parse URL encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware for handling cookies
app.use(cookieParser());

// Middleware to handle CORS headers
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Setting up routes for different API endpoints
app.use("/users", userRoutes);
app.use("/Manual", ManualRoutes);
app.use("/Items", ItemRoutes);
app.use("/Supplies", SuppliesRoutes);
app.use("/Preparedness", PreparednessRoutes);

// Setting up port and database connection
const port = process.env.PORT || 4000; // Setting port from environment variable or default to 4000
const db = process.env.DB; // Getting database connection string from environment variable

// Connecting to MongoDB using Mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to MongoDB with useNewUrlParser and useUnifiedTopology options
  .then(() => {
    // Start Express server
    app.listen(port, "0.0.0.0", () =>
      console.log("Connection done and running on PORT :" + port)
    );
  })
  .catch((err) => console.log(err.message)); // Log error if connection fails
