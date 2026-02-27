const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const { publishEvent } = require("../events/eventBus");
const { Op } = require("sequelize");

const EXCHANGE = "hrms.employee";

// --- Employee CRUD ---

async function createEmployee(data) {
  const existing = await Employee.findOne({ where: { userId: data.userId } });
  if (existing) {
    throw Object.assign(new Error("Employee profile already exists for this user"), {
      status: 409,
    });
  }

  const count = await Employee.count();
  data.employeeCode = `EMP${String(count + 1).padStart(5, "0")}`;

  const employee = await Employee.create(data);

  await publishEvent(EXCHANGE, "employee.created", {
    employeeId: employee.id,
    userId: employee.userId,
    salary: employee.salary,
    department: employee.department,
  });

  return employee;
}

async function getById(id) {
  const employee = await Employee.findByPk(id);
  if (!employee) {
    throw Object.assign(new Error("Employee not found"), { status: 404 });
  }
  return employee;
}

async function getByUserId(userId) {
  const employee = await Employee.findOne({ where: { userId } });
  if (!employee) {
    throw Object.assign(new Error("Employee not found"), { status: 404 });
  }
  return employee;
}

async function getAll() {
  return Employee.findAll({ where: { status: { [Op.ne]: "terminated" } } });
}

async function update(id, updates) {
  const employee = await Employee.findByPk(id);
  if (!employee) {
    throw Object.assign(new Error("Employee not found"), { status: 404 });
  }
  await employee.update(updates);

  await publishEvent(EXCHANGE, "employee.updated", {
    employeeId: employee.id,
    userId: employee.userId,
    salary: employee.salary,
    department: employee.department,
    status: employee.status,
  });

  return employee;
}

async function terminate(id) {
  const employee = await Employee.findByPk(id);
  if (!employee) {
    throw Object.assign(new Error("Employee not found"), { status: 404 });
  }
  await employee.update({
    status: "terminated",
    dateOfTermination: new Date().toISOString().split("T")[0],
  });

  await publishEvent(EXCHANGE, "employee.terminated", {
    employeeId: employee.id,
    userId: employee.userId,
  });

  return { message: "Employee terminated" };
}

// --- Attendance ---

async function checkIn(employeeId) {
  const today = new Date().toISOString().split("T")[0];
  const [record] = await Attendance.findOrCreate({
    where: { employeeId, date: today },
    defaults: { employeeId, date: today, checkIn: new Date(), status: "present" },
  });
  if (!record.checkIn) {
    await record.update({ checkIn: new Date(), status: "present" });
  }
  return record;
}

async function checkOut(employeeId) {
  const today = new Date().toISOString().split("T")[0];
  const record = await Attendance.findOne({ where: { employeeId, date: today } });
  if (!record) {
    throw Object.assign(new Error("No check-in found for today"), { status: 400 });
  }
  await record.update({ checkOut: new Date() });
  return record;
}

async function getAttendance(employeeId, startDate, endDate) {
  return Attendance.findAll({
    where: {
      employeeId,
      date: { [Op.between]: [startDate, endDate] },
    },
    order: [["date", "ASC"]],
  });
}

// --- Leave ---

async function applyLeave(data) {
  return LeaveRequest.create(data);
}

async function approveLeave(leaveId, approvedBy) {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) {
    throw Object.assign(new Error("Leave request not found"), { status: 404 });
  }
  await leave.update({ status: "approved", approvedBy });
  return leave;
}

async function rejectLeave(leaveId) {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) {
    throw Object.assign(new Error("Leave request not found"), { status: 404 });
  }
  await leave.update({ status: "rejected" });
  return leave;
}

async function getLeaves(employeeId) {
  return LeaveRequest.findAll({
    where: { employeeId },
    order: [["createdAt", "DESC"]],
  });
}

module.exports = {
  createEmployee,
  getById,
  getByUserId,
  getAll,
  update,
  terminate,
  checkIn,
  checkOut,
  getAttendance,
  applyLeave,
  approveLeave,
  rejectLeave,
  getLeaves,
};
