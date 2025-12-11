import LeaveType from "../models/LeaveType.js";

export const createLeaveType = async (req, res) => {
    try {
        const { name, description, max_days } = req.body;

        if (!name || !max_days) {
            return res.status(400).json({ message: "Name and maxDays required" });
        }

        const exists = await LeaveType.findOne({ where: { name } });
        if (exists) {
            return res.status(400).json({ message: "Leave type already exists" });
        }

        const leaveType = await LeaveType.create({ name, description, max_days });
        res.status(201).json({ message: "Leave Type created", leaveType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const getLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.findAll();
        res.json(leaveTypes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateLeaveType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, max_days } = req.body;

        const leaveType = await LeaveType.findByPk(id);
        if (!leaveType) {
            return res.status(404).json({ message: "Leave Type not found" });
        }

        await leaveType.update({ name, description, max_days });

        res.json({ message: "Leave Type updated", leaveType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteLeaveType = async (req, res) => {
    try {
        const { id } = req.params;

        const leaveType = await LeaveType.findByPk(id);
        if (!leaveType) {
            return res.status(404).json({ message: "Leave Type not found" });
        }

        await leaveType.destroy();

        res.json({ message: "Leave Type deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};