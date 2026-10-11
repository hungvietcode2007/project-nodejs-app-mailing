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
    const templateContent = (accessToken) => {
      return `<div
  style="
    background-color: #f4efe6;
    padding: 40px 15px;
    font-family: &quot;Georgia&quot;, serif;
  "
>
  <div
    style="
      max-width: 580px;
      margin: 0 auto;
      background-color: #fffdf9;
      border: 1px solid #e2d9cc;
      border-radius: 6px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      padding: 35px 30px;
      color: #333333;
      line-height: 1.8;
    "
  >
    <div
      style="
        border-bottom: 2px dashed #dcd3c4;
        padding-bottom: 15px;
        margin-bottom: 25px;
        text-align: center;
      "
    >
      <h2
        style="
          margin: 0;
          color: #5a4a42;
          font-size: 22px;
          font-weight: normal;
          letter-spacing: 1px;
          font-family: &quot;Times New Roman&quot;, Times, serif;
        "
      >
      Bức thư gửi tương lai của bạn đã được ghi nhận
      </h2>
    </div>
    <div style="font-size: 15px; color: #2c2523; white-space: pre-line">
      <h3 style="margin-top: 0; color: #3d322d">Gửi tôi của tương lai,</h3>
      <p
        style="
          line-height: 40px;
          font-family:
            &quot;Comic Sans MS&quot;, &quot;Segoe Print&quot;,
            &quot;Bradley Hand&quot;, &quot;Caveat&quot;, cursive;
        "
      >Chào bạn thân mến,
      Cảm ơn bạn đã dành thời gian sử dụng dịch vụ Future Letter 💝,
      Mong rằng những ngày tháng sắp tới của bạn sẽ thật tươi đẹp và trọn vẹn. Chúc bạn của hiện tại luôn an yên, và bạn của mai sau sẽ đạt được mọi điều mong ước nhé.
      Bạn có thể xem tình trạng thư của mình <a href="https://project-nodejs-app-mailing.onrender.com/${accessToken}" target="_blank">tại đây</a>
      </p>
    </div>
  </div>
  <div
    style="
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #9c9289;
    "
  >
    Bạn có thể liên hệ với tác giả
    <a href="https://www.facebook.com/hung.ang.959587">tại đây</a>
    <br />
    Bức thư được gửi tự động bởi dịch vụ
    <strong>Future Letter</strong>
  </div>
</div>
`;
    };
    const formatContent = templateContent(access_token);
    await sendMail(
      email,
      "Xác nhận: Bức thư gửi tương lai của bạn đã được ghi nhận",
      formatContent,
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
