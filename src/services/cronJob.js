const cron = require("node-cron");
const connection = require("../config/database");
const { sendMail } = require("./nodemailer");
const formatToVNDate = (utcDateString) => {
  const date = new Date(utcDateString);
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
const templateMail = (createdAt, letterBody) => {
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
        ✉️ BỨC THƯ TỪ QUÁ KHỨ
      </h2>
      <p
        style="
          margin: 6px 0 0;
          font-size: 13px;
          color: #8c827a;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        Được viết vào ngày: ${createdAt}
      </p>
    </div>

    <!-- Nội dung bức thư -->
    <div style="font-size: 15px; color: #2c2523; white-space: pre-line">
      <h3 style="margin-top: 0; color: #3d322d">Gửi tôi của tương lai,</h3>
      <p
        style="
          background-image: repeating-linear-gradient(
            transparent 0px,
            transparent 38.5px,
            rgba(0, 0, 0, 0.3) 38.5px,
            rgba(0, 0, 0, 0.3) 40px
          );
          line-height: 40px;
          font-family:
            &quot;Comic Sans MS&quot;, &quot;Segoe Print&quot;,
            &quot;Bradley Hand&quot;, &quot;Caveat&quot;, cursive;
        "
      >${letterBody}
      </p>
    </div>
    <div
      style="
        margin-top: 35px;
        border-top: 1px solid #eee6db;
        padding-top: 15px;
        text-align: right;
        font-style: italic;
        color: #6b5e57;
      "
    >
      Thân gửi,
      <br />
      <strong
        style="
          font-family:
            &quot;Franklin Gothic Medium&quot;, &quot;Arial Narrow&quot;, Arial,
            sans-serif;
        "
      >
        tôi từ quá khứ
      </strong>
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
const startCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const [letters] = await connection.execute(`
        SELECT
        id,recipient_email,content,created_at
        FROM letters
        WHERE status="pending" AND send_at<=UTC_TIMESTAMP()
        `);
      if (letters.length === 0) return;
      for (const letter of letters) {
        try {
          const createAt = formatToVNDate(letter.created_at);
          const formatContent = templateMail(createAt, letter.content);
          await sendMail(
            letter.recipient_email,
            "Lời nhắn tới từ quá khứ",
            formatContent,
          );
          await connection.query(
            `UPDATE letters SET status='sent' WHERE id=? `,
            [letter.id],
          );
        } catch (err) {
          console.log(`Thư tới ${letter.recipient_email} đã bị lỗi:${err}`);
          await connection.query(
            `UPDATE letters SET status='failed' WHERE id=? `,
            [letter.id],
          );
        }
      }
    } catch (db_err) {
      console.log("Lỗi truy vấn DB:", db_err);
    }
  });
};
module.exports = { startCronJob };
