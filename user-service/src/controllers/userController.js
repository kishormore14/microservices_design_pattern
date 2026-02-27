const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await userService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function deactivate(req, res, next) {
  try {
    const result = await userService.deactivate(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw Object.assign(new Error("Missing or invalid authorization header"), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.getById(decoded.userId);
    res.json(user);
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(Object.assign(new Error("Invalid or expired token"), { status: 401 }));
    }
    next(err);
  }
}

module.exports = { register, login, getById, getAll, update, deactivate, profile };
