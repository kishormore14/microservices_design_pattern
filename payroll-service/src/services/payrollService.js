const Payroll = require("../models/Payroll");
const axios = require("axios");
const { publishEvent } = require("../events/eventBus");

const EXCHANGE = "hrms.payroll";
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || "http://localhost:3002";

// Synchronous call to EmployeeService to get employee data
async function fetchEmployee(employeeId) {
  try {
    const { data } = await axios.get(`${EMPLOYEE_SERVICE_URL}/api/employees/${employeeId}`);
    return data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw Object.assign(new Error("Employee not found"), { status: 404 });
    }
    throw Object.assign(new Error("Failed to reach Employee Service"), { status: 502 });
  }
}

// Synchronous call to get attendance for salary calc
async function fetchAttendance(employeeId, startDate, endDate) {
  try {
    const { data } = await axios.get(
      `${EMPLOYEE_SERVICE_URL}/api/employees/${employeeId}/attendance`,
      { params: { startDate, endDate } }
    );
    return data;
  } catch {
    return [];
  }
}

function calculateTax(baseSalary) {
  const annual = baseSalary * 12;
  if (annual <= 250000) return 0;
  if (annual <= 500000) return baseSalary * 0.05;
  if (annual <= 1000000) return baseSalary * 0.2;
  return baseSalary * 0.3;
}

async function generatePayroll(employeeId, month, year) {
  const existing = await Payroll.findOne({
    where: { employeeId, month, year },
  });
  if (existing) {
    throw Object.assign(new Error("Payroll already exists for this period"), {
      status: 409,
    });
  }

  const employee = await fetchEmployee(employeeId);

  // Get attendance for the month to calculate deductions
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
  const attendance = await fetchAttendance(employeeId, startDate, endDate);

  const baseSalary = parseFloat(employee.salary);
  const workingDays = 22;
  const absentDays = attendance.filter((a) => a.status === "absent").length;
  const perDaySalary = baseSalary / workingDays;
  const deductions = absentDays * perDaySalary;
  const tax = calculateTax(baseSalary);
  const netSalary = baseSalary - deductions - tax;

  const payroll = await Payroll.create({
    employeeId,
    month,
    year,
    baseSalary,
    deductions: Math.round(deductions * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    bonus: 0,
    netSalary: Math.round(netSalary * 100) / 100,
    status: "processed",
  });

  await publishEvent(EXCHANGE, "payroll.processed", {
    payrollId: payroll.id,
    employeeId,
    month,
    year,
    netSalary: payroll.netSalary,
  });

  return payroll;
}

async function getPayrollByEmployee(employeeId) {
  return Payroll.findAll({
    where: { employeeId },
    order: [["year", "DESC"], ["month", "DESC"]],
  });
}

async function getPayslip(id) {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) {
    throw Object.assign(new Error("Payroll record not found"), { status: 404 });
  }
  return payroll;
}

async function markAsPaid(id) {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) {
    throw Object.assign(new Error("Payroll record not found"), { status: 404 });
  }
  await payroll.update({ status: "paid", paidAt: new Date() });

  await publishEvent(EXCHANGE, "payroll.paid", {
    payrollId: payroll.id,
    employeeId: payroll.employeeId,
    netSalary: payroll.netSalary,
  });

  return payroll;
}

async function getAllForPeriod(month, year) {
  return Payroll.findAll({
    where: { month, year },
    order: [["createdAt", "ASC"]],
  });
}

module.exports = {
  generatePayroll,
  getPayrollByEmployee,
  getPayslip,
  markAsPaid,
  getAllForPeriod,
};
