const jwt = require("jsonwebtoken");

const USER = {
  email: "tecnico@prefeitura.rio",
  password: "painel@2024"
};

function login(email, password) {
  if (email !== USER.email || password !== USER.password) {
    return null;
  }

  const token = jwt.sign(
    { preferred_username: email },
    "segredo_super",
    { expiresIn: "1h" }
  );

  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, "segredo_super");
  } catch (err) {
    return null;
  }
}

module.exports = {
  login,
  verifyToken
};