import api from "@/lib/api";

export type Summary = {
  total: number;

  alertas: {
    saude: number;
    educacao: number;
    assistencia: number;
  };

  revisados: number;
};

interface BairroStats {
  bairro: string;
  totalAlertas: number;
  saude: number;
  educacao: number;
  assistencia: number;
}

interface HistoryLog {
  tipo: string;
  valor: number;
  criado_em: string;
}

export async function getSummary(): Promise<Summary> {
  const res = await api.get("/summary");
  return res.data;
}

export async function getHistory(limit : number): Promise<HistoryLog[]> {
  const res = await api.get(`/summary/stats-history/${limit}`);
  return res.data;
}

export async function getHeatmap(): Promise<BairroStats[]> {
  const res = await api.get("/summary/heatmap");
  return res.data;
}