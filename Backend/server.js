require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const folderRoutes = require("./routes/folders");
const fileRoutes = require("./routes/files");

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port :  https://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log(err));
