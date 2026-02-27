const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { connectRabbitMQ } = require("./events/eventBus");
const { runBasicUsersMigration } = require("./migrations/seedBasicUsers");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

// Routes
app.use("/api/users", userRoutes);

// Error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("[UserService] Database connected");
    await sequelize.sync({ alter: true });
    console.log("[UserService] Models synced");
    await runBasicUsersMigration();
    console.log("[UserService] Basic users migration completed");

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`[UserService] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[UserService] Failed to start:", err);
    process.exit(1);
  }
}

start();
