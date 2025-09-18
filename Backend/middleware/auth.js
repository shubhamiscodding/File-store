// middleware/auth.js
const admin = require("../firebaseAdmin"); // import initialized admin
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Find user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(401).json({ message: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
