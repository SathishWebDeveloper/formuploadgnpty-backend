const mongoose = require('mongoose');

// File schema for MongoDB
const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'outhregisterSchema' },
  filePath: { type: String, required: true }, // Local file path
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', FileSchema);
module.exports = File;
