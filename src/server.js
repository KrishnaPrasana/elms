import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import leaveTypeRoutes from "./routes/leaveTypeRoutes.js";
import leaveAppRoutes from "./routes/leaveApplicationRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";





dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin/departments", departmentRoutes)
app.use("/api/admin/leave-types", leaveTypeRoutes)
app.use("/api/leaves", leaveAppRoutes);
app.use("/api/admin/employees", employeeRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes)


// Test route
app.get("/", (req, res) => {
    res.send("ELMS Backend Running with PostgreSQL");
});

// Sync database & start server
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced successfully");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => console.log(err));