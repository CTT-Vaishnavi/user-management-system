const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");          // ✅ added for CORS
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());                       // ✅ correct place (after app init)
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Test route (optional but useful)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});