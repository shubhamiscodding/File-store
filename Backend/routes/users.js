const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Helper for logging
const logError = (location, err) => {
  console.error(`[ERROR] ${location}:`, err.message);
};

// ----------------------------
// Register or update user
// ----------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, firebaseUid, googleId, role } = req.body;

    if (!name || !email || !firebaseUid) {
      return res.status(400).json({ message: "Name, email, and firebaseUid are required" });
    }

    // Find existing user
    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });

    if (user) {
      // Update user if details changed
      user.name = name || user.name;
      user.email = email || user.email;
      if (googleId) user.googleId = googleId;
      if (role) user.role = role;

      await user.save();
      return res.status(200).json({ message: "User already exists, updated", user });
    }

    // Create new user
    const newUser = new User({ name, email, firebaseUid, googleId, role });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User created", user: savedUser });
  } catch (err) {
    logError("Register", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Login → fetch from DB using firebaseUid
// ----------------------------
router.post("/login", async (req, res) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ message: "firebaseUid is required" });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    logError("Login", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Get profile
// ----------------------------
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    logError("Profile", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
