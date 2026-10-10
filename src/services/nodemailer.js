require("dotenv").config();

const nodemailer = require("nodemailer");
const email_send = process.env.EMAIL_USER;
const email_send_pass = process.env.EMAIL_PASSWORD;
console.log("User check:", process.env.EMAIL_USER);
console.log("Pass check exists?:", Boolean(process.env.EMAIL_PASSWORD));
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: email_send,
    pass: email_send_pass,
  },
  tls: {
    rejectUnauthorized: false,
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
