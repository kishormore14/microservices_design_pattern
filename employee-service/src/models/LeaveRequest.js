const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaveRequest = sequelize.define(
  "LeaveRequest",
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
    leaveType: {
      type: DataTypes.ENUM("sick", "casual", "earned", "unpaid"),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "leave_requests",
    timestamps: true,
  }
);

module.exports = LeaveRequest;
