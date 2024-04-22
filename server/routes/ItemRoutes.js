import express from "express";
import createItem from "../controllers/Items/CreateItem.js";
import { validateJWT } from "../middlewares/validateToken.js";
import getAllItems from "../controllers/Items/getAllItems.js";
import getItemById from "../controllers/Items/getItemById.js";
import updateItem from "../controllers/Items/updateItem.js";
import deleteItem from "../controllers/Items/deleteItem.js";
import itemchart from "../controllers/Items/ItemChart.js";
import getDetailById from "../controllers/Items/ItemDetail.js";
import Reportno from "../controllers/Items/Reportno.js";
const router = express.Router();

router.post("/newItem", validateJWT, createItem);
router.get("/total", getItemById);
router.get("/", getAllItems);
router.get("/:id", getDetailById);
router.get("/chart/itemchart", itemchart);
router.get("/items/reportno", validateJWT, Reportno);
router.put("/update/:id", validateJWT, updateItem);
router.delete("/delete/:id", deleteItem);

export default router;
