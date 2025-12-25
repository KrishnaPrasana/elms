import { User, Department } from "../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";




//add Employee (Admin only)
export const AddEmployee = async (req, res) => {
    try {
        const { name, email, empId, password, departmentIds } = req.body;

        if (!name || !email || !empId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const role = "employee"

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const existingEmpId = await User.findOne({ where: { empId } });
        if (existingEmpId) return res.status(400).json({ message: "Employee ID already exists" });

        // Only validate departments for employees
        let departments = [];
        if (!departmentIds || !departmentIds.length) {
            return res.status(400).json({ message: "Employee must have at least one department" });
        }

        departments = await Department.findAll({
            where: { id: departmentIds }
        });

        if (departments.length !== departmentIds.length) {
            return res.status(400).json({ message: "Some department IDs are invalid" });
        }

        const rawPassword = crypto.randomBytes(6).toString("hex");
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const user = await User.create({
            name,
            email,
            empId,
            password: hashedPassword,
            role,
        });

        // Associate departments after user creation
        await user.setDepartments(departments);

        res.status(201).json({ message: "User created successfully", user });

        // const employee = await User.
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


// Get all employees (Admin only)
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.findAll({
            where: { role: "employee" },
            include: [{ model: Department }],
            attributes: { exclude: ["password"] }, // hide password
        });

        res.json({ employees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update employee status (active/inactive) - Admin only
export const updateEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const employee = await User.findByPk(id);
        if (!employee || employee.role !== "employee") {
            return res.status(404).json({ message: "Employee not found" });
        }

        await employee.update({ status });
        const safeEmployee = {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            empId: employee.empId,
            status: employee.status,
            role: employee.role,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
        };
        res.json({
            message: `Employee status updated to ${status}`,
            employee: safeEmployee,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}