const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    firebaseUid: { type: String, required: true, unique: true }, // Firebase UID instead of clerkId
    googleId: { type: String }, // optional if you want to track Google OAuth
    role: { type: String, enum: ["user", "admin"], default: "user" }, // role-based access
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
