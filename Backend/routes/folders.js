const express = require("express");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const logError = (location, err) => console.error(`[ERROR] ${location}:`, err.message);

// Create folder
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    if (!name) return res.status(400).json({ message: "Folder name is required" });

    const folder = new Folder({
      name,
      user: req.auth.userId,
      parentFolder: parentFolder || null,
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    logError("Create folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List folders
router.get("/", requireAuth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: false });
    res.json(folders);
  } catch (err) {
    logError("Get folders", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Rename folder
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { name: req.body.name },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.json(folder);
  } catch (err) {
    logError("Rename folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
