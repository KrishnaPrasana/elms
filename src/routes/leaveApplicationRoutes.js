import express from "express";
import { applyLeave, updateLeaveStatus, getLeaveApplications } from "../controllers/leaveApplicationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// All routes protected
router.use(protect);

// Employee applies for leave
router.post("/apply", authorizeRoles("employee"), applyLeave);

// Employee/Admin view leave applications
router.get("/", authorizeRoles("employee", "admin"), getLeaveApplications);

// Admin approves/rejects leave
router.put("/:id/status", authorizeRoles("admin"), updateLeaveStatus);

export default router;
