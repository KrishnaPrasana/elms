import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LeaveType = sequelize.define("LeaveType", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    max_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

export default LeaveType;
