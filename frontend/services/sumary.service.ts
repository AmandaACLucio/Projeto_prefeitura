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

export async function getSummary(): Promise<Summary> {
  const res = await api.get("/summary");
  return res.data;
}

export async function getHistory(): Promise<Summary> {
  const res = await api.get("/stats-history");
  return res.data;
}

export async function getHeatmap(): Promise<Summary> {
  const res = await api.get("/heatmap");
  return res.data;
}