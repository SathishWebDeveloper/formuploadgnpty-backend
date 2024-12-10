const mongoose = require('mongoose');

const NewFileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'outhregisterSchema' },
    fileName: { type: String, required: true }, // Local file path
    email: { type: String, required: true },
    eventDetails: { type: String, required: true },
    location:{ type: String, required: true },
    format:{ type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    longitude:{type:Number , required : true},
    latitude:{type:Number, required:true}
})

const FileGenerate = mongoose.model('NewFileGenerate' , NewFileSchema);
module.exports = FileGenerate;