const express = require("express");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// ----------------------------
// Create folder
// ----------------------------
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, parentFolder } = req.body; // optional parent folder
    const folder = new Folder({
      name,
      user: req.auth.userId,
      parentFolder: parentFolder || null,
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Get all folders for the user (not trashed)
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: false });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Rename folder
// ----------------------------
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { name: req.body.name },
      { new: true }
    );
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Move folder to trash (soft delete)
// ----------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: true },
      { new: true }
    );
    res.json({ message: "Folder moved to trash", folder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Restore folder from trash
// ----------------------------
router.put("/restore/:id", requireAuth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: false },
      { new: true }
    );
    res.json({ message: "Folder restored", folder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Get trashed folders
// ----------------------------
router.get("/trash", requireAuth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: true });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
