const { sendMail } = require("../services/nodemailer");
const { createLetter } = require("../services/CRUDServices");
const connection = require("../config/database");
const crypto = require("crypto");
const getLandingPage = async (req, res) => {
  res.render("landingPage", { page: "landing page" });
};
const getWritePage = async (req, res) => {
  res.render("writePage", { page: "write", err: undefined, oldData: {} });
};
const calculateSendAt = (months) => {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);
  const dateStr = targetDate.toLocaleDateString("en-CA");
  return `${dateStr} 01:00:00`;
};
const createLetterPost = async (req, res) => {
  try {
    const { email, deliver_in, specific_date, public, content } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).render("writePage", {
        page: "write",
        error: "email",
        oldData: req.body,
      });
    }
    if (!deliver_in && !specific_date) {
      return res.status(400).render("writePage", {
        page: "write",
        error: "date",
        oldData: req.body,
      });
    }
    if (!content || !content.trim()) {
      return res.status(400).render("writePage", {
        page: "write",
        error: "content",
        oldData: req.body,
      });
    }
    const is_public = public ? 1 : 0;
    const access_token = crypto.randomUUID();
    let send_at;
    if (deliver_in) {
      const months = parseInt(deliver_in, 10);
      send_at = calculateSendAt(months);
    } else if (specific_date) {
      send_at = `${specific_date} 01:00:00`;
    }
    const values = [];
    values.push([access_token, email, content, send_at, is_public]);
    await createLetter(values);
    const appUrl =
      process.env.APP_URL || "https://project-nodejs-app-mailing.onrender.com";

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #2b6cb0;">Xác nhận lưu thư thành công</h2>
    <p>Xin chào,</p>
    <p>Hệ thống <strong>Future Letter</strong> đã ghi nhận bức thư gửi đến tương lai của bạn.</p>
    <p>Bạn có thể theo dõi tiến trình và trạng thái gửi của bức thư bằng cách nhấn vào liên kết bên dưới:</p>
    <div style="margin: 24px 0;">
      <a href="${appUrl}/${access_token}" style="background-color: #3182ce; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Xem chi tiết bức thư
      </a>
    </div>
    <p style="font-size: 13px; color: #718096;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
  </div>
`;
    await sendMail(
      email,
      "Xác nhận: Bức thư gửi tương lai của bạn đã được ghi nhận",
      htmlContent,
    );

    res.redirect(`/${access_token}`);
  } catch (err) {
    console.log(err);
    res.send(
      "server đang bị lỗi, vui lòng đợi chúng tôi khắc phục hoặc liên hệ với chúng tôi qua zalo:0328159778",
    );
  }
};
const getStoragePage = async (req, res) => {
  const access_token = req.params.access_token;
  const [results] = await connection.query(
    `SELECT * FROM letters WHERE access_token=?`,
    [access_token],
  );
  res.render("storagePage", {
    page: "storage",
    send_date: results[0].send_at,
    access_token: access_token,
  });
};
const getPublicPage = async (req, res) => {
  const [letters] = await connection.query(
    `SELECT content,send_at FROM letters WHERE public=1`,
  );
  res.render("publicPage", { page: "public", letters: letters });
};
module.exports = {
  getLandingPage,
  getWritePage,
  getStoragePage,
  createLetterPost,
  getPublicPage,
};
