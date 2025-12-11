import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();

// Login
router.post("/login", login);

// Register a user (Admin can create employees)
router.post("/register", protect, authorizeRoles("admin"), register);


export default router;
