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
  data_nascimento: string;
  revisado: boolean;
  alertas: Alerta[];
  createdAt?: string;
  saude?: Saude;
  educacao?: Educacao;
  assistencia?: Assistencia;
}

export interface CreateChildInput {
  nome: string;
  responsavel: string;
  bairro: string;
  alertasIds?: string[] | number[]; 
}

export type UpdateChildInput = Partial<CreateChildInput>;