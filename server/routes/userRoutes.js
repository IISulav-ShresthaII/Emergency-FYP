import express from "express";

import createUser from "../controllers/user/createUser.js";
import { loginUser } from "../controllers/user/loginUser.js";
// import { renewToken } from "../controllers/user/renewToken.js";
import { updateUser } from "../controllers/user/updateUser.js";
import { validateJWT } from "../middlewares/validateToken.js";
import { createStaff } from "../controllers/User/CreateStaff.js";
import getUserById from "../controllers/User/getUserById.js";
import userchart from "../controllers/User/UserChart.js";
const router = express.Router();

router.post("/create", createUser);
router.put("/update/:id", validateJWT, updateUser);
router.get("/total", getUserById);
router.post("/login", loginUser);
router.get("/userchart", userchart);
// router.post("/renew", validateJWT, renewToken);
router.post("/create-staff", validateJWT, createStaff);

export default router;
