require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users");
const folderRoutes = require("./routes/folders");
const fileRoutes = require("./routes/files");
const searchRoutes = require("./routes/search");
const trashRoutes = require("./routes/trash");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Replace with your frontend URL in production
  credentials: true
}));

// Health check route
app.get("/", (req, res) => res.send("🟢 API is running!"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/trash", trashRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server", error: err.message });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
