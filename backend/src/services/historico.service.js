const prisma = require("../lib/prisma");

async function gerarSnapshotDashboard() {
  const totalCriancas = await prisma.child.count();
  
  const totalSaude = await prisma.alerta.count({
    where: { area: "saude" }
  });
  
  const totalEducacao = await prisma.alerta.count({
    where: { area: "educacao" }
  });
  
  const totalAssistencia = await prisma.alerta.count({
    where: { area: "assistencia" }
  });

  await prisma.historico.createMany({
    data: [
      { tipo: "total_criancas", valor: totalCriancas },
      { tipo: "saude", valor: totalSaude },
      { tipo: "educacao", valor: totalEducacao },
      { tipo: "assistencia", valor: totalAssistencia },
    ]
  });

  return { message: "Snapshot de histórico gerado com sucesso" };
}

async function getHistorico(limit) {
  const take = parseInt(limit, 10);
  return prisma.historico.findMany({
    orderBy: { criado_em: 'desc' },
    take: take
  });
}

module.exports = { gerarSnapshotDashboard, getHistorico };