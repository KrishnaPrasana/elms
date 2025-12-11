// routes/departmentRoutes.js
import express from "express";
import {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
} from "../controllers/departmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("admin"), createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.put("/:id", authorizeRoles("admin"), updateDepartment);
router.delete("/:id", authorizeRoles("admin"), deleteDepartment);
export default router;
