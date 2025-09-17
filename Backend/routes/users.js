const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, clerkId, googleId } = req.body;

    if (!name || !email || !clerkId) {
      return res.status(400).json({ message: "Name, email, and clerkId are required" });
    }

    // Check if user already exists by clerkId OR email
    const existingUser = await User.findOne({ $or: [{ clerkId }, { email }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, clerkId, googleId });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
