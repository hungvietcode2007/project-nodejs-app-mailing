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
router.get("/:access_token", getStoragePage);
module.exports = router;
