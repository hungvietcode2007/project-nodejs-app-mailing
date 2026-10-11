const connection = require("../config/database");
const createLetter = async (values) => {
  await connection.query(
    `INSERT INTO letters(access_token, recipient_email, content, reason, send_at, public)
    VALUES ?`,
    [values],
  );
};
module.exports = { createLetter };
