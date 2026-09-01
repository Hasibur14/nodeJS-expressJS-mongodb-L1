const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const blogRoutes = require("./routes/blogRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Core middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello World! Backend API is running !!"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// Routes - each new resource gets its own file under /routes, mounted here
app.use("/api/blogs", blogRoutes);

// 404 + error handler must be last
app.use(notFound);
app.use(errorHandler);

module.exports = app;
