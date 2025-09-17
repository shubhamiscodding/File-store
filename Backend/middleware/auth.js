// middleware/auth.js
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

const requireAuth = ClerkExpressRequireAuth();

module.exports = async (req, res, next) => {
  try {
    // Clerk userId
    const clerkId = req.auth.userId;

    // Find or create user in Mongo
    let user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(401).json({ message: "User not found in database" });
    }

    // Attach MongoDB user _id instead of just Clerk ID
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Authentication error" });
  }
};
