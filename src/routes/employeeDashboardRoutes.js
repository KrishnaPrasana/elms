import express from "express";
import { getEmployeeDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";


const router = express.Router();
router.use(protect)

router.get("/",getEmployeeDashboard);

export default router;
