const express = require("express");
const File = require("../models/File");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// ----------------------------
// Move file/folder to trash
// ----------------------------
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

      // Trash all files in this folder
      await File.updateMany(
        { folder: req.params.id, user: req.auth.userId },
        { isTrashed: true }
      );

      // Trash all direct subfolders
      await Folder.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: true }
      );
    }

    res.json({ message: "Item moved to trash", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Restore file/folder from trash
// ----------------------------
router.put("/restore/:id", requireAuth, async (req, res) => {
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

      // Restore all files in folder
      await File.updateMany(
        { folder: req.params.id, user: req.auth.userId },
        { isTrashed: false }
      );

      // Restore all direct subfolders
      await Folder.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: false }
      );
    }

    res.json({ message: "Item restored", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Get all trashed items
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    const trashedFiles = await File.find({
      user: req.auth.userId,
      isTrashed: true,
    });

    const trashedFolders = await Folder.find({
      user: req.auth.userId,
      isTrashed: true,
    });

    res.json({ files: trashedFiles, folders: trashedFolders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Permanently delete file/folder
// ----------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;

    if (type === "file") {
      await File.findOneAndDelete({
        _id: req.params.id,
        user: req.auth.userId,
        isTrashed: true,
      });
    } else if (type === "folder") {
      // Delete folder itself
      await Folder.findOneAndDelete({
        _id: req.params.id,
        user: req.auth.userId,
        isTrashed: true,
      });

      // Delete all files inside folder
      await File.deleteMany({
        folder: req.params.id,
        user: req.auth.userId,
        isTrashed: true,
      });

      // Delete all subfolders
      await Folder.deleteMany({
        parentFolder: req.params.id,
        user: req.auth.userId,
        isTrashed: true,
      });
    }

    res.json({ message: "Item permanently deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Restore multiple items by IDs
// ----------------------------
router.put("/restore", requireAuth, async (req, res) => {
  try {
    const { files = [], folders = [] } = req.body;

    if (files.length > 0) {
      await File.updateMany(
        { _id: { $in: files }, user: req.auth.userId },
        { isTrashed: false }
      );
    }

    if (folders.length > 0) {
      await Folder.updateMany(
        { _id: { $in: folders }, user: req.auth.userId },
        { isTrashed: false }
      );
    }

    res.json({ message: "Selected items restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
// ----------------------------