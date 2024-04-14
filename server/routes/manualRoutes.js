import express from "express";
import createManual from "../controllers/Manual/CreateManual.js";
import { validateJWT, isStaff } from "../middlewares/validateToken.js"; // Import isStaff middleware
import getAllManual from "../controllers/Manual/getAllManual.js";
import getManualById from "../controllers/Manual/getManualById.js";
import updateManual from "../controllers/Manual/updateManual.js";
import deleteManual from "../controllers/Manual/deleteManual.js";

const router = express.Router();

router.post("/newManual", validateJWT, isStaff, createManual); // Apply isStaff middleware
router.get("/:id", getManualById);
router.get("/", getAllManual);
router.put("/update/:id", validateJWT, updateManual);
router.delete("/delete/:id", validateJWT, isStaff, deleteManual); // Apply isStaff middleware

export default router;
