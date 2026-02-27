const svc = require("../services/employeeService");

async function create(req, res, next) {
  try {
    const employee = await svc.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    res.json(await svc.getById(req.params.id));
  } catch (err) { next(err); }
}

async function getByUserId(req, res, next) {
  try {
    res.json(await svc.getByUserId(req.params.userId));
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    res.json(await svc.getAll());
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    res.json(await svc.update(req.params.id, req.body));
  } catch (err) { next(err); }
}

async function terminate(req, res, next) {
  try {
    res.json(await svc.terminate(req.params.id));
  } catch (err) { next(err); }
}

async function checkIn(req, res, next) {
  try {
    res.json(await svc.checkIn(req.params.id));
  } catch (err) { next(err); }
}

async function checkOut(req, res, next) {
  try {
    res.json(await svc.checkOut(req.params.id));
  } catch (err) { next(err); }
}

async function getAttendance(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    res.json(await svc.getAttendance(req.params.id, startDate, endDate));
  } catch (err) { next(err); }
}

async function applyLeave(req, res, next) {
  try {
    res.status(201).json(await svc.applyLeave({ ...req.body, employeeId: req.params.id }));
  } catch (err) { next(err); }
}

async function approveLeave(req, res, next) {
  try {
    res.json(await svc.approveLeave(req.params.leaveId, req.body.approvedBy));
  } catch (err) { next(err); }
}

async function rejectLeave(req, res, next) {
  try {
    res.json(await svc.rejectLeave(req.params.leaveId));
  } catch (err) { next(err); }
}

async function getLeaves(req, res, next) {
  try {
    res.json(await svc.getLeaves(req.params.id));
  } catch (err) { next(err); }
}

module.exports = {
  create, getById, getByUserId, getAll, update, terminate,
  checkIn, checkOut, getAttendance,
  applyLeave, approveLeave, rejectLeave, getLeaves,
};
