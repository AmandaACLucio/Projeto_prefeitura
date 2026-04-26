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
  let tags = new Map();

  for (const c of children) {
    c.alertas?.forEach(alert => {
      alert.area === "saude" ? saude++ :
      alert.area === "educacao" ? educacao++ :
      alert.area === "assistencia" ? assistencia++ : null;

      tags.has(alert.tipo) 
        ? tags.set(alert.tipo, tags.get(alert.tipo) + 1) 
        : tags.set(alert.tipo, 1);
    });

    c.revisado ? revisados++ : null;
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