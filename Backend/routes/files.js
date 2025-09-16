const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ----------------------------
// Upload file
// ----------------------------
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const file = new File({
      name: req.file.originalname,
      url: req.file.path, // local path, replace with cloud storage later
      folder: req.body.folderId || null,
      user: req.auth.userId,
    });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// List files in folder
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    const { folderId } = req.query;
    const files = await File.find({
      user: req.auth.userId,
      folder: folderId || null,
      isTrashed: false,
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Rename file
// ----------------------------
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { name: req.body.name },
      { new: true }
    );
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Move file to another folder
// ----------------------------
router.post("/move", requireAuth, async (req, res) => {
  try {
    const { fileId, folderId } = req.body;
    const file = await File.findOneAndUpdate(
      { _id: fileId, user: req.auth.userId },
      { folder: folderId },
      { new: true }
    );
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Soft delete (move to trash)
// ----------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: true },
      { new: true }
    );
    res.json({ message: "File moved to trash", file });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Get trashed files
// ----------------------------
router.get("/trash/list", requireAuth, async (req, res) => {
  try {
    const files = await File.find({ user: req.auth.userId, isTrashed: true });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Restore file from trash
// ----------------------------
router.put("/restore/:id", requireAuth, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: false },
      { new: true }
    );
    res.json({ message: "File restored", file });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Download file
// ----------------------------
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.auth.userId });
    if (!file) return res.status(404).json({ message: "File not found" });
    res.download(file.url, file.name);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Share file
// ----------------------------
router.post("/:id/share", requireAuth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.auth.userId });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Generate a new shareId if not exists
    if (!file.shareId) {
      const crypto = require("crypto");
      file.shareId = crypto.randomUUID();
      await file.save();
    }

    const shareLink = `${process.env.APP_URL}/files/share/${file.shareId}`;
    res.json({ shareLink });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Access shared file via shareId
// ----------------------------
router.get("/share/:shareId", async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId });
    if (!file) return res.status(404).json({ message: "Invalid share link" });

    res.download(file.url, file.name); // or just return metadata if you prefer
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
