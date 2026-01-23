require("dotenv").config();

const app = require("./app.js");
const connectDB = require("../config/database.js");

// Connect MongoDB FIRST
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
