const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "half_day", "on_leave"),
      defaultValue: "present",
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["employeeId", "date"] },
    ],
  }
);

module.exports = Attendance;
