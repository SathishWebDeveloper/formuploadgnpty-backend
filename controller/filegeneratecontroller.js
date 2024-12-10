const FileGenerate = require("../modal/filegeneratemodal");
const createError = require("http-errors");
// const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

const axios = require('axios');
require("dotenv").config();

function generateXLS(data) {
  console.log("Data");

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Data", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    // Initialize the row index
    let rowIndex = 2;

    let row = worksheet.getRow(rowIndex);
    row.values = ["Task # id", "Name", "Status"];
    row.font = { bold: true };

    const columnWidths = [20, 20, 20];

    row.eachCell((cell, colNumber) => {
      const columnIndex = colNumber - 1;
      const columnWidth = columnWidths[columnIndex];
      worksheet.getColumn(colNumber).width = columnWidth;
    });

    // Loop over the grouped data
    data.forEach((task, index) => {
      const row = worksheet.getRow(rowIndex + index + 1);
      row.getCell("A").value = task.id;
      row.getCell("B").value = task.name;
      row.getCell("C").value = task.status;

      row.getCell("B").alignment = { wrapText: true };
    });
    // Increment the row index
    rowIndex += data.length;

    // Merge cells for the logo
    worksheet.mergeCells(
      `A1:${String.fromCharCode(65 + worksheet.columns.length - 1)}1`
    );

    //   const image = workbook.addImage({
    //     base64: LOGO_64, //replace it your image (base 64 in this case)
    //     extension: "png",
    //   });

    //   worksheet.addImage(image, {
    //     tl: { col: 0, row: 0 },
    //     ext: { width: 60, height: 40 },
    //   });

    worksheet.getRow(1).height = 40;

    // Define the border style
    const borderStyle = {
      style: "thin", // You can use 'thin', 'medium', 'thick', or other valid styles
      color: { argb: "00000000" },
    };

    // Loop through all cells and apply the border style
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: borderStyle,
          bottom: borderStyle,
        };
      });
    });

    // Generate the XLS file
    return workbook.xlsx.writeBuffer();
  } catch (err) {
    console.log(err);
  }
}

// find the coordinates using api dynamically and get the data 
const fetchData = async (location) => {
    try {
      const apiKey = process.env.GEOAPIFY; // Replace with your actual API key
      const url = `https://api.geoapify.com/v1/geocode/search?text=${location}&format=json&apiKey=${apiKey}`;
  
      // Use axios to make the request
      const response = await axios.get(url);
  
      // Extract the data from the response
      const data = response.data;
  
    //   console.log("res location",data);
      if(data?.results[0]){
          return data?.results[0];
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return null;
    }
  };


const fileGenerateUserEnterData = async (req, res) => {

  // console.log("req", req.user._id , req.name , req.email)
  const { name, email, eventDetails, location, fileFormat } = req.body;

  const {lon , lat } = await fetchData(location);

  try {
    const fileMetadata = new FileGenerate({
      userId: req.user._id,
      fileName: name,
      email: email,
      eventDetails: eventDetails,
      location: location,
      format: fileFormat,
      longitude : lon || "78.6870296",
      latitude : lat || "10.804973"
    });

    console.log("test123");
    await fileMetadata.save();
    res
      .status(200)
      .json({ message: "File uploaded successfully", file: fileMetadata });
  } catch (err) {
    console.error("Error uploading file:");
    res.status(500).json({ message: "File upload failed" });
  }
};

const getGenerateFileData = async (req, res) => {
  try {
    console.log("req.user._id", req.user._id);
    const files = await FileGenerate.find({ userId: req.user._id });
    // console.log("find", files)
    res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Failed to retrieve files" });
  }
};

const generateFileBackend = async (req, res, next) => {
  const { _id } = req.body;
  console.log("Request body:", req.body);

  try {
    // Fetch file record from the database
    const fileRecord = await FileGenerate.findById(_id);
    console.log("file-------------------", fileRecord);

    if (!fileRecord) {
      return next(createError(404, "Record not found"));
    }

    if (fileRecord.format === "PDF") {
      // Create a new PDF document
      const doc = new PDFDocument();

      // Set the response to indicate it's a PDF file
      res.contentType("application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=user-data.pdf"
      );

      // Pipe the PDF content directly into the response
      doc.pipe(res);

      // Add text to the PDF
      doc.fontSize(18).text(`Name: ${fileRecord.fileName}`, { align: "left" });
      doc.fontSize(16).text(`Email: ${fileRecord.email}`, { align: "left" });
      doc
        .fontSize(14)
        .text(`Event Details: ${fileRecord.eventDetails}`, { align: "left" });
      doc
        .fontSize(14)
        .text(`Location: ${fileRecord.location}`, { align: "left" });

      // Add an image (adjust path and size as necessary)
      // const imagePath = './path/to/your/image.jpg'; // Provide path to your image
      // doc.image(imagePath, { width: 300, height: 200, align: 'center' });

      // Finalize and send the PDF document
      return doc.end();
      //   res.status(200).json({ message: "File Created successfully" });
    } else if (fileRecord.format === "Excel") {
      console.log("testing =====================================>");
      //   let tasks = [
      //     { id: 1, name: "task1", status: "approved" },
      //     { id: 2, name: "task2", status: "denied" },
      //   ];
      //   if (tasks.length > 0) {
      //     const xlsBuffer = await generateXLS(tasks);
      //     res.set("Content-Disposition", "attachment; sathish.xls");
      //     res.type("application/vnd.ms-excel");
      //     return res.send(xlsBuffer);

      /////////////////////////////////////////////////////////////////////Method 2 to create a excel

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      // Add some data to the worksheet
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "EventDetails", key: "eventDetails", width: 30 },
        { header: "location", key: "location", width: 30 }
      ];

      worksheet.addRow({ id: 1, name: `${fileRecord.fileName}` , email : `${fileRecord.email}` ,  eventDetails : `${fileRecord.eventDetails}`
         , location : `${fileRecord.location}`});
    //   worksheet.addRow({ id: 2, name: "Jane Doe" });

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="file.xlsx"');

      // Write the workbook to a buffer
      await workbook.xlsx.write(res);
      res.end();
    }
    // }
    else {
      return res.status(400).json({ message: "Unsupported file format" });
    }
  } catch (err) {
    console.error("Error:", err);
    next(createError(500, "Internal Server Error"));
  }
};


/// get the location list 
const getAllLocationList = async(req,res) => {
  
  console.log("Request body:", req.body);

  try{
    console.log("req.user._id", req.user._id);
    const files = await FileGenerate.find({ userId: req.user._id });
    const modifyLocation = files?.map((item)=> ({ lat: item.latitude, lng: item.longitude, location: item.location }))
    console.log("file-------------------", modifyLocation);
    res.status(200).json({ message: "location fetched successfully" , data : modifyLocation });

  }
  catch(err){
    console.log("error", err)
  }

}
module.exports = {
  fileGenerateUserEnterData,
  getGenerateFileData,
  generateFileBackend,
  getAllLocationList
};
