const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    employeeCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfJoining: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dateOfTermination: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "on_leave", "terminated"),
      defaultValue: "active",
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

module.exports = Employee;
