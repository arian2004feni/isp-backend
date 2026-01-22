const express = require("express");
const cors = require("cors");

// Import routes
const routes = require("../routes/index.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Demo route / modules routes
app.use("/api", routes);

module.exports = app;
