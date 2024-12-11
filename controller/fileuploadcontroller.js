
const File = require('../modal/fileuploadregister');
const { sendEmailAttachFile } = require('../utility/fileattachemail');

const fileUploadList = async (req, res) => {
    try {
      const fileMetadata = new File({
        userId: req.user._id,
        filePath: req.file.path, // Local file path
        fileName: req.file.originalname,
      });
      console.log("test123")
      await fileMetadata.save();
      res.status(200).json({ message: 'File uploaded successfully', file: fileMetadata });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  };

  const showUploadedFiles = async (req,res) => {
    try {
      console.log("req.user._id" , req.user._id)
      const files = await File.find({ userId: req.user._id });
      // console.log("find", files)
      res.status(200).json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ message: 'Failed to retrieve files' });
    }
  }

  const sendUploadFileMail = async (req,res) => {
    const {fileId,} = req.body; 
    console.log("req", req.body);
    console.log("req.user._id" , req.user._id , req.user.email)
    try {
      console.log("req.user._id" , req.user._id)
      const files = await File.findOne({ _id: fileId });
      console.log("find", files)
      if (!files) {
        return res.status(404).json({ message: "File not found" });
      }
      if(files){
        const {fileName , filePath } = files ;
        
        const emailSent = await sendEmailAttachFile(req.user.email,fileName, filePath);
        if (emailSent) {
          return res.status(200).json({ message: `email sent successfully to ${req.user.email}`});
        } 
        else {
          return res.status(500).json({ message: "Login successful, but email failed to send" });
        }
  
      }

      // res.status(200).json({ message: 'Failed to retrieve files' });
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ message: 'Failed to retrieve files' });
    }

  }

module.exports = {
  fileUploadList,
  showUploadedFiles,
  sendUploadFileMail
};
