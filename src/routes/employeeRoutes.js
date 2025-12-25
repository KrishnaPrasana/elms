import express from "express";
import { AddEmployee, getAllEmployees, getEmployee, updateEmployeeStatus } from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect);

router.post("/", authorizeRoles("admin"), AddEmployee);
router.get("/", authorizeRoles("admin"), getAllEmployees);
router.put("/:id/status", authorizeRoles("admin"), updateEmployeeStatus);
router.get("/:id", getEmployee)
export default router;
