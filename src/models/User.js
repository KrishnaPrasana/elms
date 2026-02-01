import { DataTypes, Op } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    empId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("admin", "employee"),
        defaultValue: "employee",
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
    },
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


User.beforeCreate(async (user, options) => {
  if (!user.empId) {
    const year = new Date().getFullYear();
    const latestUser = await User.findOne({
      where: {
        empId: {
          [Op.like]: `EMP-${year}-%`
        }
      },
      order: [['createdAt', 'DESC']]
    });

    let next = 1;
    if (latestUser && latestUser.empId) {
      const match = latestUser.empId.match(/EMP-\d{4}-(\d+)/);
      if (match) next = parseInt(match[1]) + 1;
    }

    user.empId = `EMP-${year}-${String(next).padStart(4, '0')}`;
  }
});

export default User;
