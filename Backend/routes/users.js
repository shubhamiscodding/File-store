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
    const { name, email, clerkId, googleId } = req.body;
    console.log("Register request:", { name, email, clerkId, googleId });

    if (!name || !email || !clerkId) {
      console.log("Missing required fields in register request");
      return res.status(400).json({ message: "Name, email, and clerkId are required" });
    }

    // Find existing user
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });

    if (user) {
      // Update user if details changed
      user.name = name || user.name;
      user.email = email || user.email;
      if (googleId) user.googleId = googleId;

      await user.save();
      console.log("User exists, updated:", user._id);
      return res.status(200).json({ message: "User already exists, updated", user });
    }

    // Create new user
    const newUser = new User({ name, email, clerkId, googleId });
    const savedUser = await newUser.save();

    console.log("New user created:", savedUser._id);
    res.status(201).json({ message: "User created", user: savedUser });
  } catch (err) {
    logError("Register", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------------
// Login → fetch from DB
// ----------------------------
router.post("/login", async (req, res) => {
  try {
    const { clerkId } = req.body;
    console.log("Login request for clerkId:", clerkId);

    if (!clerkId) {
      console.log("clerkId missing in login request");
      return res.status(400).json({ message: "clerkId is required" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      console.log("User not found for clerkId:", clerkId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User login successful:", user._id);
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
    console.log("Fetching profile for user:", req.user._id);
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User not found for profile request:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    logError("Profile", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
