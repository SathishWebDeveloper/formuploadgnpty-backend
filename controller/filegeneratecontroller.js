const FileGenerate = require('../modal/filegeneratemodal');
const fileGenerateUserEnterData =  async(req,res) => {
    // console.log("req", req.user._id , req.name , req.email)
    const {name , email , eventDetails , location , fileFormat} = req.body;
    try{
        const fileMetadata = new FileGenerate({
            userId: req.user._id,
            fileName: name,
            email: email,
            eventDetails: eventDetails,
            location: location,
            format: fileFormat
             });
          
          console.log("test123")
          await fileMetadata.save();
          res.status(200).json({ message: 'File uploaded successfully', file: fileMetadata });

    }
    catch(err){
        console.error('Error uploading file:');
        res.status(500).json({ message: 'File upload failed' });
    }
}

module.exports = {
    fileGenerateUserEnterData
}