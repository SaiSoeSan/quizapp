const express = require("express");
const { authRoutes, adminRoutes, studentRoutes } = require("./routes");
const app = express();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swagger");
const swaggerSpec = swaggerJsdoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz App API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      student: "/api/student",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
