// routes/user.js
const express = require("express");
const requireAuth = require("../middleware/auth");
const router = express.Router();

// GET /api/users/profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    // Clerk automatically attaches user info to req.auth
    const { userId } = req.auth;
    res.json({ userId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
