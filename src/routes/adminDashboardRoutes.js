import express from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect)

router.get("/", authorizeRoles("admin"), getAdminDashboard);

export default router;
