const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const data = require("../src/data/seed.json");

async function main() {
  console.log("Iniciando seed...");

  // Variáveis para calcular o snapshot inicial
  let totalAlertasSaude = 0;
  let totalAlertasEdu = 0;
  let totalAlertasAssis = 0;

  for (const c of data) {
    // Incrementa contadores para o histórico baseado no JSON
    totalAlertasSaude += (c.saude?.alertas?.length || 0);
    totalAlertasEdu += (c.educacao?.alertas?.length || 0);
    totalAlertasAssis += (c.assistencia_social?.alertas?.length || 0);

    await prisma.child.create({
      data: {
        id: c.id,
        nome: c.nome,
        data_nascimento: new Date(c.data_nascimento),
        bairro: c.bairro,
        responsavel: c.responsavel,
        revisado: c.revisado,
        revisado_por: c.revisado_por,
        revisado_em: c.revisado_em ? new Date(c.revisado_em) : null,

        saude: c.saude
          ? {
              create: {
                ultima_consulta: new Date(c.saude.ultima_consulta),
                vacinas_em_dia: c.saude.vacinas_em_dia
              }
            }
          : undefined,

        educacao: c.educacao
          ? {
              create: {
                escola: c.educacao.escola,
                frequencia_percent: c.educacao.frequencia_percent
              }
            }
          : undefined,

        assistencia: c.assistencia_social
          ? {
              create: {
                cad_unico: c.assistencia_social.cad_unico,
                beneficio_ativo: c.assistencia_social.beneficio_ativo
              }
            }
          : undefined,

        alertas: {
          create: [
            ...(c.saude?.alertas || []).map(a => ({
              tipo: a,
              area: "saude"
            })),
            ...(c.educacao?.alertas || []).map(a => ({
              tipo: a,
              area: "educacao"
            })),
            ...(c.assistencia_social?.alertas || []).map(a => ({
              tipo: a,
              area: "assistencia"
            }))
          ]
        }
      }
    });
  }

  // ADICIONA O HISTÓRICO INICIAL
  console.log("Gerando snapshot inicial no histórico...");
  await prisma.historico.createMany({
    data: [
      { tipo: "total_criancas", valor: data.length },
      { tipo: "alertas_saude", valor: totalAlertasSaude },
      { tipo: "alertas_educacao", valor: totalAlertasEdu },
      { tipo: "alertas_assistencia", valor: totalAlertasAssis },
    ]
  });
}

main()
  .then(() => console.log("Seed concluído com histórico inicial 🌱"))
  .catch(e => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });