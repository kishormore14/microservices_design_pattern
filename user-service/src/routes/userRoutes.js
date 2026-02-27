const { Router } = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/userController");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("role").optional().isIn(["admin", "hr_manager", "employee"]),
  ],
  validate,
  controller.register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  validate,
  controller.login
);

router.get("/profile", controller.profile);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.deactivate);

module.exports = router;
