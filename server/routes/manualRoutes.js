import express from "express";
import createManual from "../controllers/Manual/CreateManual.js";
import { validateJWT } from "../middlewares/validateToken.js";
import getAllManual from "../controllers/Manual/getAllManual.js";
import getManualById from "../controllers/Manual/getManualById.js";
import updateManual from "../controllers/Manual/updateManual.js";
import deleteManual from "../controllers/Manual/deleteManual.js";

const router = express.Router();

router.post("/newManual", validateJWT, createManual);
router.get("/:id", getManualById);
router.get("/", getAllManual);
router.put("/update/:id", validateJWT, updateManual);
router.delete("/delete/:id", deleteManual);

export default router;
