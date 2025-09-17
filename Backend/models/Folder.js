const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Text index for search
folderSchema.index({ name: "text" });

module.exports = mongoose.model("Folder", folderSchema);
