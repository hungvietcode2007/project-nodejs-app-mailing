const cron = require("node-cron");
const connection = require("../config/database");
const { sendMail } = require("./nodemailer");
const startCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const [letters] = await connection.execute(`
        SELECT
        id,recipient_email,content
        FROM letters
        WHERE status="pending" AND send_at<=UTC_TIMESTAMP()
        `);
      if (letters.length === 0) return;
      for (const letter of letters) {
        try {
          await sendMail(
            letter.recipient_email,
            "Lời nhắn tới từ quá khứ",
            letter.content,
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
