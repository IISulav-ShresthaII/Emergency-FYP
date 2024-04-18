import express from "express";
import createSupplies from "../controllers/Supplies/CreateSupplies.js";
import { validateJWT, isStaff } from "../middlewares/validateToken.js"; // Import isStaff middleware
import getAllSupplies from "../controllers/Supplies/getAllSupplies.js";
import getSuppliesById from "../controllers/Supplies/getSuppliesById.js";
import updateSupplies from "../controllers/Supplies/updateSupplies.js";
import deleteSupplies from "../controllers/Supplies/deleteSupplies.js";
import supplieschart from "../controllers/Supplies/SuppliesChart.js";
const router = express.Router();

router.post("/newSupplies", createSupplies);
router.get("/total", getSuppliesById);
router.get("/", getAllSupplies);
router.put("/update/:id", updateSupplies);
router.delete("/delete/:id", deleteSupplies);
router.get("/supplieschart", supplieschart);

export default router;
