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
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/trash", trashRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
