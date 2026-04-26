const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

router.post("/token", (req, res) => {
  const { email, password } = req.body;

  const token = authService.login(email, password);

  if (!token) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.json({ token });
});

module.exports = router;