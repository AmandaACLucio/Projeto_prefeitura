const express = require("express");
const router = express.Router();
const service = require("../services/summary.service");

router.get("/", async (req, res) => {
  const data = await service.getSummary();
  res.json(data);
});

module.exports = router;