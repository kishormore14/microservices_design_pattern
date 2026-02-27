const bcrypt = require("bcryptjs");
const User = require("../models/User");

const BASIC_USERS = [
  {
    email: "admin@example.com",
    password: "admin123",
    firstName: "System",
    lastName: "Admin",
    role: "admin",
  },
  {
    email: "hr@example.com",
    password: "hrmanager123",
    firstName: "HR",
    lastName: "Manager",
    role: "hr_manager",
  },
  {
    email: "employee@example.com",
    password: "employee123",
    firstName: "Default",
    lastName: "Employee",
    role: "employee",
  },
];

async function runBasicUsersMigration() {
  for (const basicUser of BASIC_USERS) {
    const hashedPassword = await bcrypt.hash(basicUser.password, 12);
    const [user, created] = await User.findOrCreate({
      where: { email: basicUser.email },
      defaults: {
        email: basicUser.email,
        password: hashedPassword,
        firstName: basicUser.firstName,
        lastName: basicUser.lastName,
        role: basicUser.role,
        isActive: true,
      },
    });

    if (!created && !user.isActive) {
      await user.update({ isActive: true });
    }
  }
}

module.exports = { runBasicUsersMigration };
