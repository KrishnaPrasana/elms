import express from "express";
import { updateMyProfile } from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect);

router.put("/profile", authorizeRoles("employee"), updateMyProfile);

export default router;
