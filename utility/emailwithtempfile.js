const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // which email service need to mention here gmail , yahoo 
  host: "smtp.gmail.com",
  port: 587,  // port is used for the encrypted email transmissions 465 is not in use  
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "harisathish459@gmail.com", // Replace with your Ethereal email
    pass: "knnc ckdr rvkp ooeb", // Replace with your Ethereal password
  },
});

async function sendmailWithTempFile(recipient, fileBuffer, fileName, mimeType,fileName) {
  const mailOptions = {
    from: 'harisathish459@gmail.com', // sender address
    to: recipient, // list of receivers
    subject: "Regarding Fullstack task"|| `Sharing file: ${fileName}`,
    text:  `Please find the attached file: ${fileName}`,
    attachments: [
      {
        filename: fileName,
        content: fileBuffer,
        contentType: mimeType,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = { sendmailWithTempFile };