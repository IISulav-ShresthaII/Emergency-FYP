import express from "express";

import createUser from "../controllers/user/createUser.js";
import { loginUser } from "../controllers/user/loginUser.js";
import { renewToken } from "../controllers/user/renewToken.js";
import { updateUser } from "../controllers/user/updateUser.js";
import { validateJWT } from "../middlewares/validateToken.js";
import { createStaff } from "../controllers/User/CreateStaff.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/update/:id", validateJWT, updateUser);
router.post("/login", loginUser);
router.post("/renew", validateJWT, renewToken);
router.post("/create-staff", validateJWT, createStaff); // New route for creating staff members

// Updated router with a new route for creating staff members

export default router;
