import express from "express";
import createSupplies from "../controllers/Supplies/CreateSupplies.js";
import { validateJWT, isStaff } from "../middlewares/validateToken.js"; // Import isStaff middleware
import getAllSupplies from "../controllers/Supplies/getAllSupplies.js";
import getSuppliesById from "../controllers/Supplies/getSuppliesById.js";
import updateSupplies from "../controllers/Supplies/updateSupplies.js";
import deleteSupplies from "../controllers/Supplies/deleteSupplies.js";

const router = express.Router();

router.post("/newSupplies", validateJWT, isStaff, createSupplies); // Apply isStaff middleware
router.get("/:id", getSuppliesById);
router.get("/", getAllSupplies);
router.put("/update/:id", validateJWT, updateSupplies);
router.delete("/delete/:id", deleteSupplies);

export default router;
