import express from "express";
import {
    createLeaveType,
    getLeaveTypes,
    updateLeaveType,
    deleteLeaveType,
    getLeaveType
} from "../controllers/leaveTypeController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// All API require JWT
router.use(protect);

// Admin only
router.post("/", authorizeRoles("admin"), createLeaveType);
router.put("/:id", authorizeRoles("admin"), updateLeaveType);
router.delete("/:id", authorizeRoles("admin"), deleteLeaveType);
router.get("/:id", authorizeRoles("admin"), getLeaveType);
// Admin + Employee
router.get("/", getLeaveTypes);

export default router;
