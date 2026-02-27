const svc = require("../services/payrollService");

async function generate(req, res, next) {
  try {
    const { employeeId, month, year } = req.body;
    const payroll = await svc.generatePayroll(employeeId, month, year);
    res.status(201).json(payroll);
  } catch (err) { next(err); }
}

async function getByEmployee(req, res, next) {
  try {
    res.json(await svc.getPayrollByEmployee(req.params.employeeId));
  } catch (err) { next(err); }
}

async function getPayslip(req, res, next) {
  try {
    res.json(await svc.getPayslip(req.params.id));
  } catch (err) { next(err); }
}

async function markAsPaid(req, res, next) {
  try {
    res.json(await svc.markAsPaid(req.params.id));
  } catch (err) { next(err); }
}

async function getForPeriod(req, res, next) {
  try {
    const { month, year } = req.query;
    res.json(await svc.getAllForPeriod(parseInt(month), parseInt(year)));
  } catch (err) { next(err); }
}

module.exports = { generate, getByEmployee, getPayslip, markAsPaid, getForPeriod };
