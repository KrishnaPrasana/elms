import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import LeaveType from "./LeaveType.js";
import Department from "./Department.js";

const LeaveApplication = sequelize.define("LeaveApplication", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
    },
    appliedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    adminRemark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adminResponseDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});


// Associations
User.hasMany(LeaveApplication, { foreignKey: "userId" });
LeaveApplication.belongsTo(User, { foreignKey: "userId" });

LeaveType.hasMany(LeaveApplication, { foreignKey: "leaveTypeId" });
LeaveApplication.belongsTo(LeaveType, { foreignKey: "leaveTypeId" });

Department.hasMany(LeaveApplication, { foreignKey: "departmentId" });
LeaveApplication.belongsTo(Department, { foreignKey: "departmentId" });


export default LeaveApplication;
