const express = require("express");
const router = express.Router();
const service = require("../services/summary.service");
const historicoService = require("../services/historico.service")
const childrenService = require("../services/children.service")

router.get("/", async (req, res) => {
  const data = await service.getSummary();
  res.json(data);
});

router.get("/stats-history", async (req, res) => {
  const history = await historicoService.getHistorico();
  res.json(history);
});

router.get("/heatmap", async (req, res) => {
  const heatmap = await childrenService.getHeatmapData();
  res.json(heatmap);
});

module.exports = router;