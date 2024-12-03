const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// Mongoose User Schema
const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
//   const User = mongoose.model('User', UserSchema);

const Register = mongoose.model('outhregisterSchema', UserSchema); // collection name 
module.exports = Register;