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

async function sendLoginEmail(toEmail, username) {
  const mailOptions = {
    from: 'harisathish459@gmail.com', // sender address
    to: toEmail, // list of receivers
    subject: "Successful Login Notification", // Subject line
    text: `Hello ${username},\n\nYou have successfully logged into your account.\n\nBest regards,\nYour App Team`, // plain text body
    html: `<p>Hello <b>${username}</b>,</p><p>You have successfully logged into your account.</p><p>Best regards,<br>Your App Team</p>`, // HTML body
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

module.exports = { sendLoginEmail };