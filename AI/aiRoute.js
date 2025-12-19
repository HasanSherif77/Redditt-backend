const express = require("express");
const { summarizePost } = require("./aiController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/summarize", authenticateToken, summarizePost);

module.exports = router;
