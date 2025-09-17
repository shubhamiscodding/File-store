const express = require("express");
const File = require("../models/File");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Helper for logging
const logDebug = (action, data) => {
  console.log(`[DEBUG] ${action}:`, JSON.stringify(data, null, 2));
};

// ----------------------------
// Move file/folder to trash
// ----------------------------
router.post("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body; // "file" or "folder"
    logDebug("Move to trash request", { type, id: req.params.id, userId: req.auth.userId });

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

      await File.updateMany({ folder: req.params.id, user: req.auth.userId }, { isTrashed: true });
      await Folder.updateMany({ parentFolder: req.params.id, user: req.auth.userId }, { isTrashed: true });
    }

    logDebug("Item trashed", item);
    res.json({ message: "Item moved to trash", item });
  } catch (err) {
    console.error("[ERROR] Move to trash:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Restore file/folder from trash
// ----------------------------
router.put("/restore/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    logDebug("Restore request", { type, id: req.params.id, userId: req.auth.userId });

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

      await File.updateMany({ folder: req.params.id, user: req.auth.userId }, { isTrashed: false });
      await Folder.updateMany({ parentFolder: req.params.id, user: req.auth.userId }, { isTrashed: false });
    }

    logDebug("Item restored", item);
    res.json({ message: "Item restored", item });
  } catch (err) {
    console.error("[ERROR] Restore item:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Get all trashed items
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    const trashedFiles = await File.find({ user: req.auth.userId, isTrashed: true });
    const trashedFolders = await Folder.find({ user: req.auth.userId, isTrashed: true });

    logDebug("Fetched trashed items", { files: trashedFiles.length, folders: trashedFolders.length });
    res.json({ files: trashedFiles, folders: trashedFolders });
  } catch (err) {
    console.error("[ERROR] Fetch trashed items:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Permanently delete file/folder
// ----------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    logDebug("Permanent delete request", { type, id: req.params.id, userId: req.auth.userId });

    if (type === "file") {
      await File.findOneAndDelete({ _id: req.params.id, user: req.auth.userId, isTrashed: true });
    } else if (type === "folder") {
      await Folder.findOneAndDelete({ _id: req.params.id, user: req.auth.userId, isTrashed: true });
      await File.deleteMany({ folder: req.params.id, user: req.auth.userId, isTrashed: true });
      await Folder.deleteMany({ parentFolder: req.params.id, user: req.auth.userId, isTrashed: true });
    }

    res.json({ message: "Item permanently deleted" });
  } catch (err) {
    console.error("[ERROR] Permanent delete:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Restore multiple items by IDs
// ----------------------------
router.put("/restore", requireAuth, async (req, res) => {
  try {
    const { files = [], folders = [] } = req.body;
    logDebug("Restore multiple request", { files, folders, userId: req.auth.userId });

    if (files.length > 0) {
      await File.updateMany({ _id: { $in: files }, user: req.auth.userId }, { isTrashed: false });
    }
    if (folders.length > 0) {
      await Folder.updateMany({ _id: { $in: folders }, user: req.auth.userId }, { isTrashed: false });
    }

    res.json({ message: "Selected items restored successfully" });
  } catch (err) {
    console.error("[ERROR] Restore multiple items:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Restore all trashed items
// ----------------------------
router.put("/restore-all", requireAuth, async (req, res) => {
  try {
    await File.updateMany({ user: req.auth.userId, isTrashed: true }, { isTrashed: false });
    await Folder.updateMany({ user: req.auth.userId, isTrashed: true }, { isTrashed: false });

    res.json({ message: "All files and folders restored successfully" });
  } catch (err) {
    console.error("[ERROR] Restore all items:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
