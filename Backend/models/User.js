const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    clerkId: { type: String, required: true, unique: true }, // Clerk user ID
    googleId: { type: String }, // optional if you want to track Google OAuth
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
