const express = require("express");
const router = express.Router();
const fileGenController = require("../controller/filegeneratecontroller");

const authVerifyAuthenticate = require("../middlewares/authverify");
router.post(
  "/upload",
  authVerifyAuthenticate,
  fileGenController.fileGenerateUserEnterData
);   // in generate component

router.get("/show",
    authVerifyAuthenticate,
    fileGenController.getGenerateFileData);  // it is just only show the data in the table from the generate files method


    router.post("/downloadupload",
      authVerifyAuthenticate,
      fileGenController.generateFileBackend); 

module.exports = router;
