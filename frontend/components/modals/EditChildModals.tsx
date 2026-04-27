"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, 
  HeartPulse, 
  GraduationCap, 
  HandHelping, 
  Save, 
  X,
  ClipboardCheck 
} from "lucide-react";

import { Section, InputField, TagInput } from "./EditComponents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChild } from "@/services/children.service";
import { Child } from "@/types/child";

// 1. Schema do Zod (A "Verdade" do seu Formulário)
const childSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  responsavel: z.string().min(1, "O responsável é obrigatório"),
  bairro: z.string().min(1, "O bairro é obrigatório"),
  saude: z.object({
    ultima_consulta: z.string(),
    vacinas_em_dia: z.boolean(),
  }),
    educacao: z.object({
    escola: z.string().optional().nullable(),
    frequencia_percent: z.number().min(0).max(100).optional(),
    }),
  assistencia: z.object({
    cad_unico: z.boolean().optional(),
    beneficio_ativo: z.boolean().optional(),
  }),
  alertas: z.array(z.object({
    tipo: z.string(),
    area: z.string()
  })),
});

type ChildFormValues = z.infer<typeof childSchema>;

interface EditChildModalProps {
  child: Child | null;
  onClose: () => void;
}

export default function EditChildModal({ child, onClose }: EditChildModalProps) {
  const queryClient = useQueryClient();

  // 2. Setup do Formulário
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema),
  });

  // Observa o array de alertas em tempo real
  const currentAlertas = watch("alertas") || [];

  // 3. Efeito para carregar os dados quando o modal abrir
  useEffect(() => {
    if (child) {
      reset({
        nome: child.nome,
        responsavel: child.responsavel,
        bairro: child.bairro,
        saude: {
          ultima_consulta: child.saude?.ultima_consulta?.split("T")[0] || "",
          vacinas_em_dia: !!child.saude?.vacinas_em_dia,
        },
        educacao: {
          escola: child.educacao?.escola || "",
          frequencia_percent: child.educacao?.frequencia_percent || 0,
        },
        assistencia: {
          cad_unico: !!child.assistencia_social?.cad_unico,
          beneficio_ativo: !!child.assistencia_social?.beneficio_ativo,
        },
        // Mapeia os alertas vindos do banco para o estado do form
        alertas: child.alertas?.map(a => ({ tipo: a.tipo, area: a.area })) || [],
      });
    }
  }, [child, reset]);

  // 4. Mutation do TanStack Query
  const mutation = useMutation({
    mutationFn: (data: ChildFormValues) => updateChild(child!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      onClose();
    },
  });

  // 5. Funções de Manipulação de Alertas (Tags)
  const handleAddTag = (tipo: string, area: string) => {
    const jaExiste = currentAlertas.some(a => a.tipo === tipo && a.area === area);
    if (!jaExiste) {
      setValue("alertas", [...currentAlertas, { tipo, area }]);
    }
  };

  const handleRemoveTag = (tipo: string, area: string) => {
    const novosAlertas = currentAlertas.filter(a => !(a.tipo === tipo && a.area === area));
    setValue("alertas", novosAlertas);
  };

  if (!child) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <form 
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white border-4 border-gray-900 w-full max-w-6xl max-h-[92vh] overflow-y-auto p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative"
      >
        {/* Botão Fechar */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-6 right-6 bg-red-500 border-2 border-gray-900 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Header */}
        <header className="mb-10 border-b-8 border-gray-900 pb-4">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <ClipboardCheck size={48} className="text-blue-600" />
            Editar Prontuário
          </h2>
          <span className="bg-yellow-400 border-2 border-gray-900 px-3 py-1 font-black text-sm inline-block mt-4">
            ID DO REGISTRO: {child.id}
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA 1: IDENTIFICAÇÃO */}
          <Section title="Dados de Identificação" icon={User} color="bg-white">
            <InputField label="Nome da Criança" name="nome" register={register} error={errors.nome} />
            <InputField label="Nome do Responsável" name="responsavel" register={register} error={errors.responsavel} />
            <InputField label="Bairro / Comunidade" name="bairro" register={register} error={errors.bairro} />
          </Section>

          {/* COLUNA 2: SAÚDE E EDUCAÇÃO */}
          <div className="space-y-4">
            <Section title="Eixo Saúde" icon={HeartPulse} color="bg-green-50">
              <InputField label="Última Visita Técnica" name="saude.ultima_consulta" type="date" register={register} />
              <label className="flex items-center gap-2 font-black text-[10px] mb-4 bg-white border-2 border-gray-900 p-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input type="checkbox" {...register("saude.vacinas_em_dia")} className="w-4 h-4 accent-black" />
                SITUAÇÃO VACINAL REGULAR
              </label>
              <TagInput area="saude" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
            </Section>

            <Section title="Eixo Educação" icon={GraduationCap} color="bg-blue-50">
              <InputField label="Unidade de Ensino" name="educacao.escola" register={register} />
              <InputField label="Frequência Escolar (%)" name="educacao.frequencia_percent" type="number" register={register}/>
              <TagInput area="educacao" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
            </Section>
          </div>

          {/* COLUNA 3: ASSISTÊNCIA E ALERTAS SOCIAIS */}
          <Section title="Assistência Social" icon={HandHelping} color="bg-purple-50">
            <div className="grid grid-cols-1 gap-2 mb-6">
              <label className="flex items-center gap-2 font-black text-[10px] bg-white border-2 border-gray-900 p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
                <input type="checkbox" {...register("assistencia.cad_unico")} className="w-4 h-4 accent-black" />
                CADASTRO ÚNICO ATIVO
              </label>
              <label className="flex items-center gap-2 font-black text-[10px] bg-white border-2 border-gray-900 p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
                <input type="checkbox" {...register("assistencia.beneficio_ativo")} className="w-4 h-4 accent-black" />
                RECEBE BENEFÍCIO (BPC/PBF)
              </label>
            </div>
            <p className="text-[10px] font-black uppercase mb-2 text-purple-900 underline italic">Alertas de Vulnerabilidade:</p>
            <TagInput area="assistencia" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
          </Section>
        </div>

        {/* Botão de Submissão */}
        <button 
          type="submit"
          disabled={mutation.isPending}
          className="w-full mt-10 bg-blue-600 text-white py-6 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black text-2xl uppercase italic flex items-center justify-center gap-4 active:bg-green-500"
        >
          <Save size={32} />
          {mutation.isPending ? "Processando no Banco..." : "Salvar Atualizações do Prontuário"}
        </button>
      </form>
    </div>
  );
}