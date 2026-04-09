import LeaveApplication from "../models/LeaveApplication.js";
import LeaveType from "../models/LeaveType.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import sendEmail from "../utils/mailer.js";


// Employee applies for leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveTypeId, fromDate, toDate, reason } = req.body;
    const userId = req.user.id;

    if (!leaveTypeId || !fromDate || !toDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (new Date(fromDate) > new Date(toDate))
      return res
        .status(400)
        .json({ message: "From date cannot be after To date" });

    // Validate leave type
    const leaveType = await LeaveType.findByPk(leaveTypeId);
    if (!leaveType)
      return res.status(400).json({ message: "Invalid leave type" });

    const departments = await req.user.getDepartments();
    if (!departments.length)
      return res
        .status(400)
        .json({ message: "User not assigned to any department" });

    const leaveApp = await LeaveApplication.create({
      userId,
      leaveTypeId,
      departmentId: departments[0].id,
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
    const { status, adminRemark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leaveApp = await LeaveApplication.findByPk(id);
    if (!leaveApp) return res.status(404).json({ message: "Leave not found" });
    const user = await User.findByPk(leaveApp.userId);
    await leaveApp.update({
      status,
      adminRemark,
      adminResponseDate: new Date(),
    });

    await sendEmail({
      to: user.email,
      subject: "Leave Application Update",
      html: `
        <p>Your leave application from ${leaveApp.fromDate} to ${leaveApp.toDate} has been <strong>${status}</strong>.</p>
        ${adminRemark ? `<p>Admin Remark: ${adminRemark}</p>` : ""}
        
      `,
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
    const { status } = req.query;

    let whereCondition = {};

    // Role-based filtering
    if (req.user.role !== "admin") {
      whereCondition.userId = req.user.id;
    }

    // Status filter (optional)
    if (status) {
      whereCondition.status = status;
    }

    const leaveApps = await LeaveApplication.findAll({
      where: whereCondition,
      include: req.user.role === "admin"
        ? [User, LeaveType, Department]
        : [LeaveType, Department],
    });

    res.json(leaveApps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single leave application details (Admin / Employee)
export const getLeaveApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveApp = await LeaveApplication.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phoneNumber", "gender", "empId"],
        },
        {
          model: LeaveType,
        },
        {
          model: Department,
        },
      ],
    });

    if (!leaveApp) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    // If employee, allow only their own leave
    if (req.user.role !== "admin" && leaveApp.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(leaveApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
