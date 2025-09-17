const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Register or update user
router.post("/register", async (req, res) => {
  try {
    const { name, email, clerkId, googleId } = req.body;

    if (!name || !email || !clerkId) {
      return res.status(400).json({ message: "Name, email, and clerkId are required" });
    }

    // Find existing user
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });

    if (user) {
      // ✅ Update user if details changed
      user.name = name || user.name;
      user.email = email || user.email;
      if (googleId) user.googleId = googleId;

      await user.save();
      return res.status(200).json({ message: "User already exists, updated", user });
    }

    // ✅ Create new user
    const newUser = new User({ name, email, clerkId, googleId });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User created", user: savedUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login → just fetch from DB
router.post("/login", async (req, res) => {
  try {
    const { clerkId } = req.body;
    if (!clerkId) return res.status(400).json({ message: "clerkId is required" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
