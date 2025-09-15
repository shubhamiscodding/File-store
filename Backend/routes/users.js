const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware.js");

router.get('/', requireAuth , async (req,res) => {
    try {
    // Clerk automatically attaches user info to req.auth
    const { userId } = req.auth;
    res.json({ userId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;