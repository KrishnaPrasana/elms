// controllers/departmentController.js
import { Department } from "../models/index.js";

// Create Department
export const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const existing = await Department.findOne({ where: { name } });
        if (existing) return res.status(400).json({ message: "Department already exists" });

        const department = await Department.create({ name });
        res.status(201).json({ message: "Department created", department });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all Departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get single Department by ID
export const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByPk(id);
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json(department);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByPk(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(department);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update Department
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const department = await Department.findByPk(id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        department.name = name || department.name;
        await department.save();

        res.json({ message: "Department updated", department });
    } catch (err) {
        console.error(err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Department name must be unique" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByPk(id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        await department.destroy();
        res.json({ message: "Department deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
