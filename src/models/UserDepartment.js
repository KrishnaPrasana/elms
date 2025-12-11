import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Department from "./Department.js";

const UserDepartment = sequelize.define("UserDepartment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

// Many-to-Many association
User.belongsToMany(Department, { through: UserDepartment, foreignKey: "userId" });
Department.belongsToMany(User, { through: UserDepartment, foreignKey: "departmentId" });

export default UserDepartment;
