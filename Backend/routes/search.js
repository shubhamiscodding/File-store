// routes/search.js
const express = require("express");
const Folder = require("../models/Folder");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i"); // case-insensitive

    const folders = await Folder.find({ user: req.auth.userId, name: regex });
    const files = await File.find({ user: req.auth.userId, name: regex });

    res.json({ folders, files });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
