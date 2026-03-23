import express from "express";
import { AddEmployee, getAllEmployees, getEmployee, updateEmployeeStatus,updateEmployee,updateMyProfile } from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect);

router.post("/", authorizeRoles("admin"), AddEmployee);
router.get("/", authorizeRoles("admin"), getAllEmployees);
router.put("/:id/status", authorizeRoles("admin"), updateEmployeeStatus);
router.put("/:id", authorizeRoles("admin"), updateEmployee);
router.put("/profile", authorizeRoles("employee"), updateMyProfile);
router.get("/:id", getEmployee)

export default router;
