const jwt = require("jsonwebtoken");
const User = require("../modal/outhregistermodal");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract token
  console.log("Token--->:");
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN); // Verify token
    console.log("decoded", decoded);
    // const user = await User.findById(decoded.user); // Get user from DB  this means i need to pass the id frontend to decode the data i only use email
    // const user = await User.findById(decoded.user); // Get user from DB
    const user = await User.findOne({ email: decoded.user });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user data to request
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
