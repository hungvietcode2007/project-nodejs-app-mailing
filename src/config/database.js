const mysql2 = require("mysql2/promise");
const connection = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  queueLimit: 0,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  timezone: "Z",
  ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
});
module.exports = connection;
