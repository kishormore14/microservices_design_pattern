const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");
const https = require("https");
const { authenticate } = require("./middleware/auth");
const { globalLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 3000;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || "http://localhost:3002";
const PAYROLL_SERVICE_URL = process.env.PAYROLL_SERVICE_URL || "http://localhost:3003";

async function safeFetchJson(url, options = {}) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const lib = parsed.protocol === "https:" ? https : http;
      const req = lib.request(
        {
          method: options.method || "GET",
          hostname: parsed.hostname,
          port: parsed.port,
          path: `${parsed.pathname}${parsed.search}`,
          headers: options.headers || {},
        },
        (response) => {
          let body = "";
          response.on("data", (chunk) => {
            body += chunk;
          });
          response.on("end", () => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
              resolve(null);
              return;
            }
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve(null);
            }
          });
        }
      );
      req.on("error", () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}

// Global middleware
app.use(helmet());
app.use(cors());
app.use(globalLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// --- Public routes (no auth) ---
// Registration and login are open
app.use(
  "/api/users/register",
  authLimiter,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/users/login",
  authLimiter,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
  })
);

// --- Protected routes (require auth) ---
app.use(
  "/api/users",
  authenticate,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/employees",
  authenticate,
  createProxyMiddleware({
    target: EMPLOYEE_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/payroll",
  authenticate,
  createProxyMiddleware({
    target: PAYROLL_SERVICE_URL,
    changeOrigin: true,
  })
);

app.get("/api/dashboard/stats", authenticate, async (req, res) => {
  const authHeader = req.headers.authorization;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [users, employees, payrolls] = await Promise.all([
    safeFetchJson(`${USER_SERVICE_URL}/api/users`, {
      headers: { Authorization: authHeader },
    }),
    safeFetchJson(`${EMPLOYEE_SERVICE_URL}/api/employees`, {
      headers: { Authorization: authHeader },
    }),
    safeFetchJson(`${PAYROLL_SERVICE_URL}/api/payroll/period?month=${month}&year=${year}`, {
      headers: { Authorization: authHeader },
    }),
  ]);

  res.json({
    users: Array.isArray(users) ? users.length : 0,
    employees: Array.isArray(employees) ? employees.length : 0,
    payrolls: Array.isArray(payrolls) ? payrolls.length : 0,
    attendanceToday: 0,
  });
});

app.get("/api/dashboard/activity", authenticate, (_req, res) => {
  res.json([]);
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
  console.log(`[API Gateway] Proxying:`);
  console.log(`  /api/users     -> ${USER_SERVICE_URL}`);
  console.log(`  /api/employees -> ${EMPLOYEE_SERVICE_URL}`);
  console.log(`  /api/payroll   -> ${PAYROLL_SERVICE_URL}`);
});
