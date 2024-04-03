import express from "express";
import createPreparedness from "../controllers/Preparedness/CreatePreparedness.js";
import { validateJWT } from "../middlewares/validateToken.js";
import getAllPreparedness from "../controllers/Preparedness/getAllPreparedness.js";
import getPreparednessById from "../controllers/Preparedness/getPreparednessById.js";
import updatePreparedness from "../controllers/Preparedness/updatePreparedness.js";
import deletePreparedness from "../controllers/Preparedness/deletePreparedness.js";

const router = express.Router();

router.post("/newPreparedness", validateJWT, createPreparedness);
router.get("/:id", getPreparednessById);
router.get("/", getAllPreparedness);
router.put("/update/:id", validateJWT, updatePreparedness);
router.delete("/delete/:id", deletePreparedness);

export default router;
