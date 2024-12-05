const express = require('express');
const createError = require("http-errors");
const app = express();
const PORT = 8000;


const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const outhRouter = require('./router/outhregroute')
const fileRouter = require('./router/fileuploadroute');
const generateFiles = require('./router/filegenerateroute');
app.use(cors());
app.use(express.json());



const connectdb = require('./db/db')
connectdb();

app.use('/uploads', express.static('uploads'));
app.use('/api/auth',outhRouter);
app.use('/api/files', fileRouter);
app.use('/api/generatefiles',generateFiles);

app.use((req,res,next)=> {
    next(createError(404, 'entered url not found'));
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message,
        // stack: err.stack
      }
    });
});
app.listen(PORT , ()=> console.log(`server is running on ${PORT}`)); 