import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";


const Department = sequelize.define("Department", {
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

    shortName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
});

Department.belongsToMany(User, {
    through: "UserDepartments",
    foreignKey: "departmentId",   // column in join table referencing Department
    otherKey: "userId",           // column in join table referencing User
    onDelete: "RESTRICT",
});

User.belongsToMany(Department, {
    through: "UserDepartments",
    foreignKey: "userId",         // column in join table referencing User
    otherKey: "departmentId",     // column in join table referencing Department
    onDelete: "RESTRICT",
});


export default Department;
