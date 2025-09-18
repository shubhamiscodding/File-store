const express = require("express");
const Folder = require("../models/Folder");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const logError = (location, err) => console.error(`[ERROR] ${location}:`, err.message);

router.get("/", requireAuth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const folderId = req.query.folderId || null;
    const userId = req.user._id;

    const folderFilter = { user: userId, isTrashed: false };
    const fileFilter = { user: userId, isTrashed: false };

    if (folderId) {
      folderFilter.parentFolder = folderId;
      fileFilter.folder = folderId;
    }

    let folders = [], files = [];
    if (query) {
      try {
        folders = await Folder.find({ ...folderFilter, $text: { $search: query } }).limit(20).sort({ createdAt: -1 });
        files = await File.find({ ...fileFilter, $text: { $search: query } }).limit(20).sort({ createdAt: -1 });
      } catch {
        const regex = new RegExp(query, "i");
        folders = await Folder.find({ ...folderFilter, name: regex }).limit(20).sort({ createdAt: -1 });
        files = await File.find({ ...fileFilter, name: regex }).limit(20).sort({ createdAt: -1 });
      }
    }

    res.json({ folders, files });
  } catch (err) {
    logError("Search", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
