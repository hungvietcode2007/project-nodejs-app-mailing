require("dotenv").config();

const nodemailer = require("nodemailer");
const email_send = process.env.EMAIL_USER;
const email_send_pass = process.env.EMAIL_PASSWORD;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Kết nối SMTP thất bại trên Render:", error);
  } else {
    console.log("✅ Máy chủ đã sẵn sàng gửi thư qua Nodemailer!");
  }
});
const sendMail = async (email_receive, subject, text) => {
  const mailOptions = {
    from: `"Hộp Thư Thời Gian" <${process.env.EMAIL_USER}>`,
    to: email_receive,
    subject: subject,
    text: text,
  };
  return await transporter.sendMail(mailOptions);
};
module.exports = { sendMail };
