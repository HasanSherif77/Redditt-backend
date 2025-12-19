const express = require("express");
const { summarizePost } = require("./aiController");

const router = express.Router();

router.post("/summarize", summarizePost);

module.exports = router;
