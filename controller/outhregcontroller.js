// const Register = require("../modal/registermodal");
const User = require("../modal/outhregistermodal");
const createError = require("http-errors");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  
      // Check if the user already exists in the database
      let user = await User.findOne({ googleId: sub });
      if(user){
        return next(createError(409, `User ${email} is already registered`));
      }

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
  
      // Respond with user data
      res.status(200).json({ message: 'User authenticated', user });
    } 
    catch (err) {
    next(createError(500, "Error not saving user data"));
  }
};

module.exports = {
  createUserList,
};
