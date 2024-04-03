import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import ItemRoutes from "./routes/ItemRoutes.js";
import SuppliesRoutes from "./routes/SuppliesRoutes.js";
import ManualRoutes from "./routes/ManualRoutes.js";
import PreparednessRoutes from "./routes/PreparednessRoutes.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.use("/users", userRoutes);
app.use("/Manual", ManualRoutes);
app.use("/Items", ItemRoutes);
app.use("/Supplies", SuppliesRoutes);
app.use("/Preparedness", PreparednessRoutes);
const port = process.env.PORT || 4000;
const db = process.env.DB;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, "0.0.0.0", () =>
      console.log("Connection done and running on PORT :" + port)
    );
  })
  .catch((err) => console.log(err.message));
