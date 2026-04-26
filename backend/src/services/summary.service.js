const prisma = require("../lib/prisma");

/**
 * DASHBOARD AGREGADO
 */
async function getSummary() {
  const children = await prisma.child.findMany({
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
      alertas: true
    }
  });

  const total = children.length;

  let saude = 0;
  let educacao = 0;
  let assistencia = 0;
  let revisados = 0;

  for (const c of children) {
    if (c.saude?.alertas?.length > 0) saude++;
    if (c.educacao?.alertas?.length > 0) educacao++;
    if (c.assistencia?.alertas?.length > 0) assistencia++;
    if (c.revisado) revisados++;
  }

  return {
    total,
    alertas: {
      saude,
      educacao,
      assistencia
    },
    revisados
  };
}

module.exports = {
  getSummary
};