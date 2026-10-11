const {
  getLandingPage,
  getWritePage,
  getStoragePage,
  createLetterPost,
  getPublicPage,
} = require("../controllers/homeControllers");

const path = require("path");
const express = require("express");
const router = express.Router();
router.get("/", getLandingPage);
router.get("/write", getWritePage);
router.post("/write", createLetterPost);
router.get("/public", getPublicPage);
const { sendMail } = require("../services/nodemailer"); // sửa đúng đường dẫn file của bạn

router.get("/test-mail", async (req, res) => {
  try {
    console.log("--- BẮT ĐẦU TEST GỬI MAIL TRÊN RENDER ---");
    console.log("USER:", process.env.EMAIL_USER);
    console.log("CLIENT_ID ton tai khong?:", !!process.env.CLIENT_ID);
    console.log("CLIENT_SECRET ton tai khong?:", !!process.env.CLIENT_SECRET);
    console.log("REFRESH_TOKEN ton tai khong?:", !!process.env.REFRESH_TOKEN);

    const info = await sendMail(
      process.env.EMAIL_USER, // gửi thử cho chính bạn
      "Test Render OAuth2",
      "Đây là email test gửi trực tiếp từ server Render!",
    );

    res.send({ status: "Thành công", messageId: info.messageId });
  } catch (error) {
    console.error("--- CHI TIẾT LỖI GỬI MAIL TRÊN RENDER ---:", error);
    res.status(500).json({
      status: "Thất bại",
      errorMessage: error.message,
      errorCode: error.code,
      stack: error.stack,
    });
  }
});
router.get("/:access_token", getStoragePage);
module.exports = router;
