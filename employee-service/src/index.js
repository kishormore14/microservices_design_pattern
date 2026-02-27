const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const { connectRabbitMQ } = require("./events/eventBus");
const { setupSubscribers } = require("./events/subscribers");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "employee-service" });
});

app.use("/api/employees", employeeRoutes);

app.use((err, req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("[EmployeeService] Database connected");
    await sequelize.sync({ alter: true });
    console.log("[EmployeeService] Models synced");

    await connectRabbitMQ();
    await setupSubscribers();

    app.listen(PORT, () => {
      console.log(`[EmployeeService] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[EmployeeService] Failed to start:", err);
    process.exit(1);
  }
}

start();
