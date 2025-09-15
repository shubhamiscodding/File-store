// routes/folder.js
const express = require("express");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Create folder
router.post("/", requireAuth, async (req, res) => {
  try {
    const folder = new Folder({
      name: req.body.name,
      user: req.auth.userId,
    });
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all folders
router.get("/", requireAuth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.auth.userId });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete folder
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Folder.findOneAndDelete({ _id: req.params.id, user: req.auth.userId });
    res.json({ message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
