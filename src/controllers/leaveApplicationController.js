import LeaveApplication from "../models/LeaveApplication.js";
import LeaveType from "../models/LeaveType.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

// Employee applies for leave
export const applyLeave = async (req, res) => {
    try {
        const { leaveTypeId, departmentId, fromDate, toDate, reason } = req.body;
        const userId = req.user.id;

        if (!leaveTypeId || !fromDate || !toDate) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Validate leave type
        const leaveType = await LeaveType.findByPk(leaveTypeId);
        if (!leaveType) return res.status(400).json({ message: "Invalid leave type" });

        // Validate department if provided
        if (departmentId) {
            const dept = await Department.findByPk(departmentId);
            if (!dept) return res.status(400).json({ message: "Invalid department" });
        }

        const leaveApp = await LeaveApplication.create({
            userId,
            leaveTypeId,
            departmentId,
            fromDate,
            toDate,
            reason,
        });

        res.status(201).json({ message: "Leave applied successfully", leaveApp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin approves/rejects leave
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const leaveApp = await LeaveApplication.findByPk(id);
        if (!leaveApp) return res.status(404).json({ message: "Leave not found" });

        await leaveApp.update({
            status,
            adminResponseDate: new Date(),
        });

        res.json({ message: `Leave ${status}`, leaveApp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Employee / Admin view leave applications
export const getLeaveApplications = async (req, res) => {
    try {
        let leaveApps;

        if (req.user.role === "admin") {
            leaveApps = await LeaveApplication.findAll({
                include: [User, LeaveType, Department],
            });
        } else {
            leaveApps = await LeaveApplication.findAll({
                where: { userId: req.user.id },
                include: [LeaveType, Department],
            });
        }

        res.json(leaveApps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
