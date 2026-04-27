const express = require("express");
const router = express.Router();
const service = require("../services/summary.service");
const historicoService = require("../services/historico.service")
const childrenService = require("../services/children.service")
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const data = await service.getSummary();
  res.json(data);
});

router.get("/stats-history/:limit", async (req, res) => {
  const history = await historicoService.getHistorico(req.params.limit);
  res.json(history);
});

router.get("/heatmap", async (req, res) => {
  const heatmap = await childrenService.getHeatmapData();
  res.json(heatmap);
});

module.exports = router;