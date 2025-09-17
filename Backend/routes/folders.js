const express = require("express");
const Folder = require("../models/Folder");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Helper for logging
const logError = (location, err) => {
  console.error(`[ERROR] ${location}:`, err.message);
};

// ----------------------------
// Create folder
// ----------------------------
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    console.log("Create folder request by user:", req.auth.userId, "Name:", name, "Parent:", parentFolder);

    if (!name) {
      console.log("Folder name missing in request");
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = new Folder({
      name,
      user: req.auth.userId,
      parentFolder: parentFolder || null,
    });

    await folder.save();
    console.log("Folder created successfully:", folder._id);
    res.status(201).json(folder);
  } catch (err) {
    logError("Create folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Get all folders (not trashed)
// ----------------------------
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("Fetching all folders for user:", req.auth.userId);
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: false });
    res.json(folders);
  } catch (err) {
    logError("Get folders", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Rename folder
// ----------------------------
router.put("/:id", requireAuth, async (req, res) => {
  try {
    console.log("Rename folder request:", req.params.id, "New name:", req.body.name);

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { name: req.body.name },
      { new: true }
    );

    if (!folder) {
      console.log("Folder not found for rename:", req.params.id);
      return res.status(404).json({ message: "Folder not found" });
    }

    console.log("Folder renamed successfully:", folder._id);
    res.json(folder);
  } catch (err) {
    logError("Rename folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Move folder to trash
// ----------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    console.log("Trash folder request:", req.params.id);

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: true },
      { new: true }
    );

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    console.log("Folder moved to trash:", folder._id);
    res.json({ message: "Folder moved to trash", folder });
  } catch (err) {
    logError("Trash folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Restore folder from trash
// ----------------------------
router.put("/restore/:id", requireAuth, async (req, res) => {
  try {
    console.log("Restore folder request:", req.params.id);

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { isTrashed: false },
      { new: true }
    );

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    console.log("Folder restored:", folder._id);
    res.json({ message: "Folder restored", folder });
  } catch (err) {
    logError("Restore folder", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Get trashed folders
// ----------------------------
router.get("/trash", requireAuth, async (req, res) => {
  try {
    console.log("Fetching trashed folders for user:", req.auth.userId);
    const folders = await Folder.find({ user: req.auth.userId, isTrashed: true });
    res.json(folders);
  } catch (err) {
    logError("Get trashed folders", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
