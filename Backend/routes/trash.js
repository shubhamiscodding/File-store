const express = require("express");
const File = require("../models/File");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const logError = (location, err) => console.error(`[ERROR] ${location}:`, err.message);

// Move to trash
router.post("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    let item;

    if (type === "file") {
      item = await File.findOneAndUpdate({ _id: req.params.id, user: req.auth.userId }, { isTrashed: true }, { new: true });
    } else if (type === "folder") {
      item = await Folder.findOneAndUpdate({ _id: req.params.id, user: req.auth.userId }, { isTrashed: true }, { new: true });
      await File.updateMany({ folder: req.params.id, user: req.auth.userId }, { isTrashed: true });
      await Folder.updateMany({ parentFolder: req.params.id, user: req.auth.userId }, { isTrashed: true });
    }

    res.json({ message: "Item moved to trash", item });
  } catch (err) {
    logError("Move to trash", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Restore from trash
router.put("/restore/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    let item;

    if (type === "file") {
      item = await File.findOneAndUpdate({ _id: req.params.id, user: req.auth.userId }, { isTrashed: false }, { new: true });
    } else if (type === "folder") {
      item = await Folder.findOneAndUpdate({ _id: req.params.id, user: req.auth.userId }, { isTrashed: false }, { new: true });
      await File.updateMany({ folder: req.params.id, user: req.auth.userId }, { isTrashed: false });
      await Folder.updateMany({ parentFolder: req.params.id, user: req.auth.userId }, { isTrashed: false });
    }

    res.json({ message: "Item restored", item });
  } catch (err) {
    logError("Restore item", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Permanently delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;

    if (type === "file") {
      await File.findOneAndDelete({ _id: req.params.id, user: req.auth.userId, isTrashed: true });
    } else if (type === "folder") {
      await Folder.findOneAndDelete({ _id: req.params.id, user: req.auth.userId, isTrashed: true });
      await File.deleteMany({ folder: req.params.id, user: req.auth.userId, isTrashed: true });
      await Folder.deleteMany({ parentFolder: req.params.id, user: req.auth.userId, isTrashed: true });
    }

    res.json({ message: "Item permanently deleted" });
  } catch (err) {
    logError("Permanent delete", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List trashed items
router.get("/", requireAuth, async (req, res) => {
  try {
    const files = await File.find({ user: req.auth.userId, isTrashed: true });
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: true });
    res.json({ files, folders });
  } catch (err) {
    logError("Get trashed items", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
