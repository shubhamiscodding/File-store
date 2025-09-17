const express = require("express");
const Folder = require("../models/Folder");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const folderId = req.query.folderId || null;

    const folderFilter = { user: req.user._id, isTrashed: false };
    const fileFilter = { user: req.user._id, isTrashed: false };

    if (folderId) {
      fileFilter.folder = folderId;
      folderFilter.parentFolder = folderId;
    }

    let folders = [];
    let files = [];

    if (query) {
      try {
        // Try full-text search
        folders = await Folder.find({
          ...folderFilter,
          $text: { $search: query },
        }).sort({ createdAt: -1 }).limit(20);

        files = await File.find({
          ...fileFilter,
          $text: { $search: query },
        }).sort({ createdAt: -1 }).limit(20);
      } catch (err) {
        console.warn("⚠️ Text search failed, falling back to regex:", err.message);

        // Fallback to regex if $text index isn’t available
        const regex = new RegExp(query, "i");
        folders = await Folder.find({ ...folderFilter, name: regex })
          .sort({ createdAt: -1 })
          .limit(20);

        files = await File.find({ ...fileFilter, name: regex })
          .sort({ createdAt: -1 })
          .limit(20);
      }
    }

    res.json({ folders, files });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
