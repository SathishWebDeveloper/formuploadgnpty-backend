
const File = require('../modal/fileuploadregister');

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
      console.log("find", files)
      res.status(200).json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ message: 'Failed to retrieve files' });
    }
  }

module.exports = {
  fileUploadList,
  showUploadedFiles
};
