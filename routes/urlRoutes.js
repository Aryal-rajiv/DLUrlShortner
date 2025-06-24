const express = require('express');
const UrlController = require("../controllers/urlcontroller");
const authMiddleware = require("../middleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});
router.get("/urls", authMiddleware, UrlController.getAllUrls);
router.post("/shorten", authMiddleware, UrlController.shortenUrl);
router.get("/redirect/:shortUrl", authMiddleware, UrlController.redirectUrl);
router.post("/login", UrlController.login);
router.post("/signup", UrlController.signup);


module.exports = router;
