const prisma = require("../lib/prisma");

/**
 * FUNÇÃO AUXILIAR: GERA SNAPSHOT NO HISTÓRICO
 * Chamada internamente sempre que houver mudanças nos dados.
 */
async function updateHistorico() {
  try {
    const [totalCriancas, alertasSaude, alertasEdu, alertasAssis] = await Promise.all([
      prisma.child.count(),
      prisma.alerta.count({ where: { area: "saude" } }),
      prisma.alerta.count({ where: { area: "educacao" } }),
      prisma.alerta.count({ where: { area: "assistencia" } }),
    ]);

    await prisma.historico.createMany({
      data: [
        { tipo: "total_criancas", valor: totalCriancas },
        { tipo: "alertas_saude", valor: alertasSaude },
        { tipo: "alertas_educacao", valor: alertasEdu },
        { tipo: "alertas_assistencia", valor: alertasAssis },
      ]
    });
  } catch (error) {
    console.error("Falha ao gerar histórico:", error);
  }
}

/**
 * LISTA COM FILTROS + PAGINAÇÃO
 */
async function listChildren(filters) {
  const { bairro, search, status, page = 1, limit = 10 } = filters;
  const where = {};

  // Filtro por Bairro
  if (bairro) where.bairro = bairro;

  // Filtro por Status (revisado)
  if (status === "true") where.revisado = true;
  if (status === "false") where.revisado = false;

  // Filtro por Nome (Busca textual)
  if (search) {
    where.nome = {
      contains: search,
      mode: 'insensitive', // Ignora maiúsculas/minúsculas
    };
  }

  // Executamos a contagem e a busca em paralelo para melhor performance
  const [totalItems, list] = await Promise.all([
    prisma.child.count({ where }),
    prisma.child.findMany({
      where,
      include: { 
        saude: true, 
        educacao: true, 
        assistencia: true, 
        alertas: true 
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { nome: 'asc' }
    })
  ]);

  // Retornamos o objeto "envelopado" que o Frontend espera
  return {
    list,
    totalItems,
    totalPages: Math.ceil(totalItems / Number(limit)),
    currentPage: Number(page)
  };
}

/**
 * DETALHE DA CRIANÇA
 */
async function getChildById(id) {
  return prisma.child.findUnique({
    where: { id },
    include: { saude: true, educacao: true, assistencia: true, alertas: true }
  });
}

/**
 * CRIAR NOVA CRIANÇA (Dispara Histórico)
 */
async function createChild(data) {
  const newChild = await prisma.child.create({
    data: {
      id: data.id,
      nome: data.nome,
      data_nascimento: new Date(data.data_nascimento),
      bairro: data.bairro,
      responsavel: data.responsavel,
      saude: data.saude ? { create: { ...data.saude, ultima_consulta: new Date(data.saude.ultima_consulta) } } : undefined,
      educacao: data.educacao ? { create: data.educacao } : undefined,
      assistencia: data.assistencia ? { create: data.assistencia } : undefined,
      alertas: data.alertas ? { create: data.alertas.map(a => ({ tipo: a.tipo, area: a.area })) } : undefined
    }
  });

  await updateHistorico();
  return newChild;
}

/**
 * MARCAR COMO REVISADO (Dispara Histórico)
 * (Geralmente revisões podem resolver alertas, mudando os números)
 */
async function markAsReviewed(id, user) {
  const updated = await prisma.child.update({
    where: { id },
    data: {
      revisado: true,
      revisado_por: user.preferred_username,
      revisado_em: new Date()
    }
  });

  await updateHistorico();
  return updated;
}

/**
 * ATUALIZAR DADOS
 */
async function updateChild(id, data) {
  const updated = await prisma.child.update({
    where: { id },
    data: {
      ...data,
      data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : undefined
    }
  });
  
  await updateHistorico();
  return updated;
}

/**
 * DELETAR CRIANÇA (Dispara Histórico)
 */
async function deleteChild(id) {
  const deleted = await prisma.child.delete({
    where: { id }
  });

  await updateHistorico();
  return deleted;
}

// No seu children.service.js ou em um novo dashboard.service.js
async function getHeatmapData() {
  const stats = await prisma.child.groupBy({
    by: ['bairro'],
    _count: {
      id: true,
    },
    where: {
      alertas: {
        some: {} // Conta apenas crianças que possuem algum alerta
      }
    }
  });

  // Transforma para um formato que o Frontend entenda fácil
  return stats.map(item => ({
    bairro: item.bairro,
    intensidade: item._count.id
  }));
}

module.exports = {
  listChildren,
  getChildById,
  markAsReviewed,
  createChild,
  updateChild,
  deleteChild,
  getHeatmapData
};