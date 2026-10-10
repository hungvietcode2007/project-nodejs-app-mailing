require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const configEngine = require("./config/viewEngine");
configEngine(app);
const webRoutes = require("./routes/web");
app.use("/", webRoutes);
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const connection = require("./config/database");
const { startCronJob } = require("./services/cronJob");
app.listen(port, hostname, () => {
  console.log(`server is running on ${hostname}:${port}`);
  startCronJob();
});
