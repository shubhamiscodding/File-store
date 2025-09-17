const express = require("express");
const Folder = require("../models/Folder");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Helper for logging errors
const logError = (location, err) => {
  console.error(`[ERROR] ${location}:`, err.message);
};

// ----------------------------
// Search folders and files
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const folderId = req.query.folderId || null;

    console.log("Search request:", { query, folderId, userId: req.user._id });

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
        })
          .sort({ createdAt: -1 })
          .limit(20);

        files = await File.find({
          ...fileFilter,
          $text: { $search: query },
        })
          .sort({ createdAt: -1 })
          .limit(20);

        console.log(`Full-text search found: ${folders.length} folders, ${files.length} files`);
      } catch (err) {
        console.warn("⚠️ Full-text search failed, using regex fallback:", err.message);

        // Fallback to regex if $text index isn’t available
        const regex = new RegExp(query, "i");

        folders = await Folder.find({ ...folderFilter, name: regex })
          .sort({ createdAt: -1 })
          .limit(20);

        files = await File.find({ ...fileFilter, name: regex })
          .sort({ createdAt: -1 })
          .limit(20);

        console.log(`Regex search found: ${folders.length} folders, ${files.length} files`);
      }
    }

    res.json({ folders, files });
  } catch (err) {
    logError("Search", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
