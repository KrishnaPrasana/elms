import express from "express";
import { getAllEmployees, updateEmployeeStatus } from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect);

router.get("/", authorizeRoles("admin"), getAllEmployees);
router.put("/:id/status", authorizeRoles("admin"), updateEmployeeStatus);

export default router;
