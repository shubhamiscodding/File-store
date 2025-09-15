// routes/trash.js
const express = require("express");
const File = require("../models/File");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Move file/folder to trash
router.post("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body; // "file" or "folder"
    let item;
    if (type === "file") {
      item = await File.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.userId },
        { isTrashed: true },
        { new: true }
      );
    } else if (type === "folder") {
      item = await Folder.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.userId },
        { isTrashed: true },
        { new: true }
      );
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Restore file/folder
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    let item;
    if (type === "file") {
      item = await File.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.userId },
        { isTrashed: false },
        { new: true }
      );
    } else if (type === "folder") {
      item = await Folder.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.userId },
        { isTrashed: false },
        { new: true }
      );
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all trashed items
router.get("/", requireAuth, async (req, res) => {
  try {
    const trashedFiles = await File.find({ user: req.auth.userId, isTrashed: true });
    const trashedFolders = await Folder.find({ user: req.auth.userId, isTrashed: true });
    res.json({ files: trashedFiles, folders: trashedFolders });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
