const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const childrenRoutes = require("./routes/children.routes");
const summaryRoutes = require("./routes/summary.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/children", childrenRoutes);
app.use("/summary", summaryRoutes);

app.get("/", (req, res) => {
  res.send("API Prefeitura rodando 🚀");
});

app.listen(3001, () => {
  console.log("Backend rodando na porta 3001");
});