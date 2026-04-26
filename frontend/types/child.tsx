export interface Alerta {
  id: string | number;
  tipo: string;
  area: "saude" | "educacao" | "assistencia";
}

export interface Saude {
  id: number;
  ultima_consulta: string;
  vacinas_em_dia: boolean;
}

export interface Educacao {
  id: number;
  escola: string;
  frequencia_percent: number;
}

export interface Assistencia {
  id: number;
  cad_unico: boolean;
  beneficio_ativo: boolean;
}

export interface Child {
  id: string | number;
  nome: string;
  responsavel: string;
  bairro: string;
  revisado: boolean;
  alertas: Alerta[];
  createdAt?: string;
  saude?: Saude;
  educacao?: Educacao;
  assistencia_social?: Assistencia;
}

// Para criação, o ID e os alertas estruturados geralmente não são enviados da mesma forma
export interface CreateChildInput {
  nome: string;
  responsavel: string;
  bairro: string;
  // Aqui você enviaria os IDs dos alertas ou um array de strings
  alertasIds?: string[] | number[]; 
}

// O Update pode ser parcial (opcional)
export type UpdateChildInput = Partial<CreateChildInput>;