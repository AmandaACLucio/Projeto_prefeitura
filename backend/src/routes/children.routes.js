const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const service = require("../services/children.service");

/**
 * GET /children
 * Lista crianças com filtros e paginação
 */
router.get("/", async (req, res) => {
  try {
    const data = await service.listChildren(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lista de crianças" });
  }
});

/**
 * GET /children/:id
 * Detalhe completo de uma criança específica
 */
router.get("/:id", async (req, res) => {
  try {
    const data = await service.getChildById(req.params.id);
    if (!data) return res.status(404).json({ error: "Criança não encontrada" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar detalhes da criança" });
  }
});

/**
 * POST /children
 * Adiciona uma nova criança ao sistema (Requer Autenticação)
 */
router.post("/", auth, async (req, res) => {
  try {
    const data = await service.createChild(req.body);
    res.status(201).json(data);
  } catch (error) {
    // Erro 400 se o ID já existir ou dados forem inválidos
    res.status(400).json({ error: "Erro ao cadastrar: " + error.message });
  }
});

/**
 * PATCH /children/:id/review
 * Registra a revisão do técnico (Requer Autenticação)
 */
router.patch("/:id/review", auth, async (req, res) => {
  try {
    const updated = await service.markAsReviewed(req.params.id, req.user);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar revisão" });
  }
});

/**
 * PUT /children/:id
 * Atualiza dados cadastrais (Requer Autenticação)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await service.updateChild(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar dados" });
  }
});

/**
 * DELETE /children/:id
 * Remove uma criança do sistema (Requer Autenticação)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    await service.deleteChild(req.params.id);
    res.status(204).send(); // Sucesso sem conteúdo de retorno
  } catch (error) {
    res.status(404).json({ error: "Criança não encontrada ou erro ao deletar" });
  }
});


module.exports = router;