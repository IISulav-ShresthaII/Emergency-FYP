import express from "express";
import Manual from "../models/Manual.js";
import createManual from "../controllers/Manual/CreateManual.js";
import { validateJWT, isStaff } from "../middlewares/validateToken.js";
import getAllManual from "../controllers/Manual/getAllManual.js";
import getManualById from "../controllers/Manual/getManualById.js";
import updateManual from "../controllers/Manual/updateManual.js";
import deleteManual from "../controllers/Manual/deleteManual.js";

const router = express.Router();

router.post("/newManual", validateJWT, isStaff, createManual);
router.get("/total", getManualById);
router.get("/", getAllManual);
router.put("/update/:id", updateManual);
router.delete("/delete/:id", deleteManual);

export default router;
