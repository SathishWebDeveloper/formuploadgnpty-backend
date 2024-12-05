const express = require("express");
const multer = require("multer");
const path = require("path");
const uploadFileController = require("../controller/fileuploadcontroller"); // Import the controller
const router = express.Router();
require("dotenv").config();

// token verify to debug the signed in user id and save it in db with that specific user it is a middleware
const jwt = require('jsonwebtoken');
const User = require('../modal/outhregistermodal'); // User model

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract token
//   console.log("Authorization header:", authHeader);
  console.log("Token--->:", token);
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN); // Verify token
    console.log("decoded", decoded)
    // const user = await User.findById(decoded.user); // Get user from DB  this means i need to pass the id frontend to decode the data i only use email
    // const user = await User.findById(decoded.user); // Get user from DB
    const user = await User.findOne({ email: decoded.user });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user data to request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req", req.user._id , file.originalname)
    cb(null, 'uploads/'); // Specify folder for storing files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user._id}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Generate a unique file name
  },
});

const upload = multer({ storage });

// Security Considerations:  // additional part

// Validate file types (e.g., only allow PDF or images):
// javascript
// Copy code
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error('Invalid file type'), false);
//     }
//     cb(null, true);
//   },
// });
// Sanitize user inputs to prevent security vulnerabilities.
// Define the file upload route

router.post("/upload",authenticateToken, upload.single("file"), uploadFileController.fileUploadList);
router.get("/show",authenticateToken, uploadFileController.showUploadedFiles);



module.exports = router;
