const express = require("express");
const router = express.Router();
const fileGenController = require("../controller/filegeneratecontroller");

const authVerifyAuthenticate = require("../middlewares/authverify");
router.post(
  "/upload",
  authVerifyAuthenticate,
  fileGenController.fileGenerateUserEnterData
);

module.exports = router;
