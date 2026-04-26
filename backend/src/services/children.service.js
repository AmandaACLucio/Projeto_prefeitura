const prisma = require("../lib/prisma");

/**
 * LISTA COM FILTROS + PAGINAÇÃO
 */
async function listChildren(filters) {
  const {
    bairro,
    hasAlert,
    revisado,
    page = 1,
    limit = 10
  } = filters;

  const where = {};

  if (bairro) {
    where.bairro = bairro;
  }

  if (revisado !== undefined) {
    where.revisado = revisado === "true";
  }

  const children = await prisma.child.findMany({
    where,
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
      alertas: true
    },
    skip: (page - 1) * Number(limit),
    take: Number(limit)
  });

  // filtro de alertas (feito em memória porque é agregado)
  let result = children;

  if (hasAlert === "true") {
    result = result.filter(c => c.alertas.length > 0);
  }

  return result;
}

/**
 * DETALHE DA CRIANÇA
 */
async function getChildById(id) {
  return prisma.child.findUnique({
    where: { id },
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
      alertas: true
    }
  });
}

/**
 * MARCAR COMO REVISADO
 */
async function markAsReviewed(id, user) {
  return prisma.child.update({
    where: { id },
    data: {
      revisado: true,
      revisado_por: user.preferred_username,
      revisado_em: new Date()
    }
  });
}

module.exports = {
  listChildren,
  getChildById,
  markAsReviewed
};