const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payroll = sequelize.define(
  "Payroll",
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
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 12 },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    deductions: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    bonus: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    netSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "processed", "paid"),
      defaultValue: "draft",
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "payroll",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["employeeId", "month", "year"] },
    ],
  }
);

module.exports = Payroll;
