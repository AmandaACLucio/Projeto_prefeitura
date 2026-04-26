const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend rodando!");
});

app.listen(3001, () => {
  console.log("Servidor na porta 3001");
});