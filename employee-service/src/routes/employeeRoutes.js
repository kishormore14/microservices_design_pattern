const { Router } = require("express");
const ctrl = require("../controllers/employeeController");

const router = Router();

// Employee CRUD
router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.get("/user/:userId", ctrl.getByUserId);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.terminate);

// Attendance
router.post("/:id/check-in", ctrl.checkIn);
router.post("/:id/check-out", ctrl.checkOut);
router.get("/:id/attendance", ctrl.getAttendance);

// Leave
router.post("/:id/leave", ctrl.applyLeave);
router.get("/:id/leave", ctrl.getLeaves);
router.put("/leave/:leaveId/approve", ctrl.approveLeave);
router.put("/leave/:leaveId/reject", ctrl.rejectLeave);

module.exports = router;
