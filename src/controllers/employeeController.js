import { User, Department } from "../models/index.js";

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
