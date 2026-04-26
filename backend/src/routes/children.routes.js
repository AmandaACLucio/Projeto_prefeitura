const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const service = require("../services/children.service");

router.get("/", async (req, res) => {
  const data = await service.listChildren(req.query);
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const data = await service.getChildById(req.params.id);

  if (!data) return res.status(404).json({ error: "Não encontrado" });

  res.json(data);
});

router.patch("/:id/review", auth, async (req, res) => {
  const updated = await service.markAsReviewed(req.params.id, req.user);
  res.json(updated);
});

module.exports = router;