import { User, Department, LeaveApplication, LeaveType } from "../models/index.js";

// Admin Dashboard Stats API
export const getAdminDashboard = async (req, res) => {
    try {
        // Stats
        const totalEmployees = await User.count({ where: { role: "employee" } });
        const totalLeaves = await LeaveApplication.count();
        const totalDepartments = await Department.count();
        const totalLeaveTypes = await LeaveType.count();
        const newLeaveApplications = await LeaveApplication.count({
            where: { status: "pending" }
        });

        // Recent 3 leave applications
        const recentLeaves = await LeaveApplication.findAll({
            limit: 3,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["name"]
                },
                {
                    model: LeaveType,
                    attributes: ["name"]
                }
            ]
        });

        const recent = recentLeaves.map(item => ({
            id: item.id,
            employeeName: item.User?.name || "",
            leaveType: item.LeaveType?.name || "",
            fromDate: item.fromDate,
            toDate: item.toDate,
            status: item.status,
        }));

        res.json({
            stats: {
                totalEmployees,
                totalLeaves,
                totalDepartments,
                newLeaveApplications,
                totalLeaveTypes

            },
            recent
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Stats (only for this employee)
    const totalLeaves = await LeaveApplication.count({
      where: { userId },
    });

    const approvedLeaves = await LeaveApplication.count({
      where: { userId, status: "approved" },
    });

    const newLeaveApplications = await LeaveApplication.count({
      where: { userId, status: "pending" },
    });

    // Recent 3 leave applications
    const recentLeaves = await LeaveApplication.findAll({
      where: { userId },
      limit: 3,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: LeaveType,
          attributes: ["name"],
        },
      ],
    });

    const recent = recentLeaves.map((item) => ({
      id: item.id,
      leaveType: item.LeaveType?.name || "",
      fromDate: item.fromDate,
      toDate: item.toDate,
      status: item.status,
    }));

    res.json({
      stats: {
        totalLeaves,
        approvedLeaves,
        newLeaveApplications,
      },
      recent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};