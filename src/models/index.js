import sequelize from "../config/db.js";
import User from "./User.js";
import Department from "./Department.js";
import LeaveType from "./LeaveType.js";
import LeaveApplication from "./LeaveApplication.js";
import UserDepartment from "./UserDepartment.js";


// Department - User (1:N)
Department.hasMany(User, { foreignKey: "departmentId" });
User.belongsTo(Department, { foreignKey: "departmentId" });

// User - LeaveApplication (1:N)
User.hasMany(LeaveApplication, { foreignKey: "employeeId" });
LeaveApplication.belongsTo(User, { foreignKey: "employeeId" });

// LeaveType - LeaveApplication (1:N)
LeaveType.hasMany(LeaveApplication, { foreignKey: "leaveTypeId" });
LeaveApplication.belongsTo(LeaveType, { foreignKey: "leaveTypeId" });

// Export models
export { sequelize, User, Department, LeaveType, LeaveApplication, UserDepartment };