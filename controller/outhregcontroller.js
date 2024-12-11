// const Register = require("../modal/registermodal");
const User = require("../modal/outhregistermodal");
const createError = require("http-errors");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//auth token verify 
const jwt = require('jsonwebtoken');
const { sendLoginEmail } = require("../utility/emailservice");


let refreshTokens = []; // Store valid refresh tokens

// Generate tokens
 function generateAccessToken(user) {
  console.log("execute", user);
  
  return jwt.sign({user}, process.env.ACCESS_TOKEN, { expiresIn: '15m' }); // Access token expires in 15 minutes
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN, { expiresIn: '7d' }); // Refresh token expires in 7 days
  refreshTokens.push(refreshToken);
  return refreshToken;
}


const createUserList = async (req, res, next) => {
    const { idToken } = req.body;

    try {
      // Verify the token with Google
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
  
      const { sub, name, email, picture } = payload;

      console.log("sub", sub , name , email)
  
      // Check if the user already exists in the database
      let user = await User.findOne({ googleId: sub });
      const accessToken =  generateAccessToken(email);
      const refreshToken =  generateRefreshToken(email); 

      
      
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'strict',
      });

      if (!user) {
        // Create a new user if not found
        user = new User({
          googleId: sub,
          name,
          email,
          picture,
        });
        await user.save();
      }
      

        const emailSent = await sendLoginEmail(email, name);
        if (emailSent) {
          return res.status(200).json({ message: 'User authenticated', user  , accessToken , refreshToken});
        } 
        else {
          return res.status(500).json({ message: "Login successful, but email failed to send" });
        }


    } 
    catch (err) {
    next(createError(500, "Error not saving user data"));
  }
};

module.exports = {
  createUserList,
};
