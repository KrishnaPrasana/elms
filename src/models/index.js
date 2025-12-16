import sequelize from "../config/db.js";
import User from "./User.js";
import Department from "./Department.js";
import LeaveType from "./LeaveType.js";
import LeaveApplication from "./LeaveApplication.js";
import UserDepartment from "./UserDepartment.js";

// ----------------------------
// USER <-> DEPARTMENT (M:N)
// ----------------------------
User.belongsToMany(Department, {
    through: UserDepartment,
    foreignKey: "userId",
});

Department.belongsToMany(User, {
    through: UserDepartment,
    foreignKey: "departmentId",
});

// ----------------------------
// USER -> LEAVE APPLICATION (1:N)
// ----------------------------
User.hasMany(LeaveApplication, {
    foreignKey: "userId",
});
LeaveApplication.belongsTo(User, {
    foreignKey: "userId",
});

// ----------------------------
// LEAVETYPE -> LEAVE APPLICATION (1:N)
// ----------------------------
LeaveType.hasMany(LeaveApplication, {
    foreignKey: "leaveTypeId",
});
LeaveApplication.belongsTo(LeaveType, {
    foreignKey: "leaveTypeId",
});

// ----------------------------
// DEPARTMENT -> LEAVE APPLICATION (1:N)
// Optional linking
// ----------------------------
Department.hasMany(LeaveApplication, {
    foreignKey: "departmentId",
});
LeaveApplication.belongsTo(Department, {
    foreignKey: "departmentId",
});

export {
    sequelize,
    User,
    Department,
    LeaveType,
    LeaveApplication,
    UserDepartment
};
