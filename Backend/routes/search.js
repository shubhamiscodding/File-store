const express = require("express");
const Folder = require("../models/Folder");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const folderId = req.query.folderId || null;

    // Base filter
    const folderFilter = { user: req.auth.userId, isTrashed: false };
    const fileFilter = { user: req.auth.userId, isTrashed: false };

    // If folderId is provided, restrict search inside that folder
    if (folderId) {
      fileFilter.folder = folderId;
      folderFilter.parentFolder = folderId;
    }

    let folders = [];
    let files = [];

    if (query) {
      // Use text search for performance
      folders = await Folder.find({
        ...folderFilter,
        $text: { $search: query },
      })
        .sort({ createdAt: -1 }) // newest first
        .limit(20);

      files = await File.find({
        ...fileFilter,
        $text: { $search: query },
      })
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      // If no query, just return empty result (or latest items if you want)
      folders = [];
      files = [];
    }

    res.json({ folders, files });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
