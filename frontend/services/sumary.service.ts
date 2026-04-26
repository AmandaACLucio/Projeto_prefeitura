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