const express = require("express");
const router = express.Router();
const outhregController = require('../controller/outhregcontroller')
// const registerController = require('../controller/registercontroler');

// router.get("/google-login", registerController.getAlluserList)

router.post("/google-login", outhregController.createUserList);



module.exports = router;