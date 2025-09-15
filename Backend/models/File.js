const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shareId: { type: String, unique: true }, // unique public share link
  isTrashed: { type: Boolean, default: false },
}, { timestamps: true });

// Generate shareId automatically when requested
fileSchema.methods.generateShareId = function () {
  this.shareId = uuidv4();
  return this.shareId;
};

module.exports = mongoose.model("File", fileSchema);