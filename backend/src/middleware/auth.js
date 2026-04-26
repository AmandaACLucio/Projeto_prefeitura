const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, "segredo_super");
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = auth;