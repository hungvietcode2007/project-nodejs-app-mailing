require("dotenv").config();

const nodemailer = require("nodemailer");
const email_send = process.env.EMAIL_USER;
const email_send_pass = process.env.EMAIL_PASSWORD;
console.log("User check:", process.env.EMAIL_USER);
console.log("Kiểm tra Client ID:", process.env.CLIENT_ID);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
const sendMail = async (email_receive, subject, html) => {
  const mailOptions = {
    from: `"Hộp Thư Thời Gian" <${process.env.EMAIL_USER}>`,
    to: email_receive,
    subject: subject,
    html: html,
  };
  return await transporter.sendMail(mailOptions);
};
module.exports = { sendMail };
