const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { publishEvent } = require("../events/eventBus");

const EXCHANGE = "hrms.user";

async function register(userData) {
  const existing = await User.findOne({ where: { email: userData.email } });
  if (existing) {
    throw Object.assign(new Error("Email already registered"), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const user = await User.create({ ...userData, password: hashedPassword });

  await publishEvent(EXCHANGE, "user.created", {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return sanitize(user);
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.isActive) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, user: sanitize(user) };
}

async function getById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  return sanitize(user);
}

async function getAll() {
  const users = await User.findAll({ where: { isActive: true } });
  return users.map(sanitize);
}

async function update(id, updates) {
  const user = await User.findByPk(id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 12);
  }

  await user.update(updates);

  await publishEvent(EXCHANGE, "user.updated", {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
  });

  return sanitize(user);
}

async function deactivate(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  await user.update({ isActive: false });

  await publishEvent(EXCHANGE, "user.deactivated", {
    userId: user.id,
    email: user.email,
  });

  return { message: "User deactivated" };
}

function sanitize(user) {
  const { password, ...data } = user.toJSON();
  return data;
}

module.exports = { register, login, getById, getAll, update, deactivate };
