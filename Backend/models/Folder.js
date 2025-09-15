// models/Folder.js
const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isTrashed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Folder", folderSchema);
