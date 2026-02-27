const { Router } = require("express");
const ctrl = require("../controllers/payrollController");

const router = Router();

router.post("/generate", ctrl.generate);
router.get("/period", ctrl.getForPeriod);
router.get("/employee/:employeeId", ctrl.getByEmployee);
router.get("/:id", ctrl.getPayslip);
router.put("/:id/pay", ctrl.markAsPaid);

module.exports = router;
