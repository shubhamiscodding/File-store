// routes/trash.js
const express = require("express");
const File = require("../models/File");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

/**
 * Move file/folder to trash
 */
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

      // ✅ Trash all files inside this folder
      await File.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: true }
      );

      // ✅ Trash all subfolders (direct children)
      await Folder.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: true }
      );
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Restore file/folder
 */
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

      // ✅ Restore all files inside this folder
      await File.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: false }
      );

      // ✅ Restore all subfolders
      await Folder.updateMany(
        { parentFolder: req.params.id, user: req.auth.userId },
        { isTrashed: false }
      );
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get all trashed items (files + folders)
 */
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

/**
 * Permanently delete file/folder from trash
 */
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

      // Delete all files inside this folder
      await File.deleteMany({
        parentFolder: req.params.id,
        user: req.auth.userId,
        isTrashed: true,
      });

      // Delete all subfolders inside this folder
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


// restoring the deleted item from trash

router.put("/restore-all", requireAuth, async (req, res) => {
  try {
    // Restore all files
    await File.updateMany(
      { user: req.auth.userId, isTrashed: true },
      { isTrashed: false }
    );

    // Restore all folders
    await Folder.updateMany(
      { user: req.auth.userId, isTrashed: true },
      { isTrashed: false }
    );

    res.json({ message: "All files and folders restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// now restoring id wise

router.put("/restore", requireAuth, async (req, res) => {
  try {
    const { files = [], folders = [] } = req.body;

    // Restore selected files
    if (files.length > 0) {
      await File.updateMany(
        { _id: { $in: files }, user: req.auth.userId },
        { isTrashed: false }
      );
    }

    // Restore selected folders
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






module.exports = router;
