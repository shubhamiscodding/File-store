const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const requireAuth = require("../middleware/auth");
const crypto = require("crypto");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const logError = (location, err) => console.error(`[ERROR] ${location}:`, err.message);

// Upload file
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = new File({
      name: req.file.originalname,
      url: req.file.path,
      folder: req.body.folderId || null,
      user: userId,
    });

    await file.save();
    res.status(201).json(file);
  } catch (err) {
    logError("Upload file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List files (optionally by folder)
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
    logError("List files", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Rename file
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { name: req.body.name },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);
  } catch (err) {
    logError("Rename file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Move file to another folder
router.post("/move", requireAuth, async (req, res) => {
  try {
    const { fileId, folderId } = req.body;
    const file = await File.findOneAndUpdate(
      { _id: fileId, user: req.auth.userId },
      { folder: folderId },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);
  } catch (err) {
    logError("Move file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Download file
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.auth.userId });
    if (!file) return res.status(404).json({ message: "File not found" });
    res.download(file.url, file.name);
  } catch (err) {
    logError("Download file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Share file
router.post("/:id/share", requireAuth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.auth.userId });
    if (!file) return res.status(404).json({ message: "File not found" });

    if (!file.shareId) {
      file.shareId = crypto.randomUUID();
      await file.save();
    }

    const shareLink = `${process.env.APP_URL}/files/share/${file.shareId}`;
    res.json({ shareLink });
  } catch (err) {
    logError("Share file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Access shared file via shareId
router.get("/share/:shareId", async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId });
    if (!file) return res.status(404).json({ message: "Invalid share link" });
    res.download(file.url, file.name);
  } catch (err) {
    logError("Access shared file", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
