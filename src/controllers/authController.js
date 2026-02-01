import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Department } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Register user (Admin creates employee)
export const register = async (req, res) => {
    try {
        const { name, email, empId, password, role, departmentIds } = req.body;

        if (!name || !email || !empId || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check unique email and empId
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const existingEmpId = await User.findOne({ where: { empId } });
        if (existingEmpId) return res.status(400).json({ message: "Employee ID already exists" });

        // Only validate departments for employees
        let departments = [];
        if (role === "employee") {
            if (!departmentIds || !departmentIds.length) {
                return res.status(400).json({ message: "Employee must have at least one department" });
            }

            departments = await Department.findAll({
                where: { id: departmentIds }
            });

            if (departments.length !== departmentIds.length) {
                return res.status(400).json({ message: "Some department IDs are invalid" });
            }
        }

        // Now create the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            empId,
            password: hashedPassword,
            role,
        });

        // Associate departments after user creation
        if (role === "employee") {
            await user.setDepartments(departments);
        }

        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const payload = { id: user.id, role: user.role, empId: user.empId };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        const departments = await user.getDepartments();

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                empId: user.empId,
                departments: departments.map(d => ({ id: d.id, name: d.name })),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const changePassword = async (req,res) => {
    try {

        const userId = req.user.id; // from JWT middleware

        const { currentPassword, newPassword } = req.body;
 
        if (!currentPassword || !newPassword) {

            return res.status(400).json({ message: "Both passwords are required" });

        }
 
        if (newPassword.length < 6) {

            return res.status(400).json({ message: "Password must be at least 6 characters" });

        }
 
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
 
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {

            return res.status(400).json({ message: "Current password is incorrect" });

        }
 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
 
        await user.update({ password: hashedPassword });
 
        res.json({ message: "Password changed successfully" });

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });

    }
 
}