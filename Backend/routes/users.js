// routes/users.js
const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/users/register
 * Add a new user to DB after Clerk registration
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, clerkId, googleId } = req.body;

    if (!name || !email || !clerkId) {
      return res.status(400).json({ message: "Name, email, and clerkId are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, clerkId, googleId });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/users/login
 * Optional: just fetch user from DB using clerkId
 * Login itself is handled by Clerk
 */
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

/**
 * GET /api/users/profile
 * Fetch logged-in user info
 */
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId; // from Clerk middleware

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
