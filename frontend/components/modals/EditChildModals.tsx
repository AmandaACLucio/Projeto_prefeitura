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

  const currentAlertas = watch("alertas") || [];

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
          cad_unico: !!child.assistencia?.cad_unico,
          beneficio_ativo: !!child.assistencia?.beneficio_ativo,
        },
        alertas: child.alertas?.map(a => ({ tipo: a.tipo, area: a.area })) || [],
      });
    }
  }, [child, reset]);

  const mutation = useMutation({
    mutationFn: (data: ChildFormValues) => updateChild(child!.id, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["children"] });
        queryClient.invalidateQueries({ queryKey: ["child", child?.id?.toString()] });
        
        onClose();
      },
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <form 
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-slate-50 w-full max-w-6xl max-h-[92vh] overflow-y-auto p-8 rounded-2xl shadow-md border border-white relative"
      >
        {/* Botão Fechar */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <ClipboardCheck size={32} className="text-blue-500" />
              Editar Prontuário
            </h2>
            <p className="text-slate-500 mt-1">Atualize as informações de acompanhamento da criança.</p>
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full mt-4 md:mt-0">
            ID: {child.id}
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA 1: IDENTIFICAÇÃO */}
          <Section title="Identificação" icon={User} color="bg-white">
            <div className="space-y-4 p-1">
              <InputField label="Nome da Criança" name="nome" register={register} error={errors.nome} />
              <InputField label="Nome do Responsável" name="responsavel" register={register} error={errors.responsavel} />
              <InputField label="Bairro / Comunidade" name="bairro" register={register} error={errors.bairro} />
            </div>
          </Section>

          {/* COLUNA 2: SAÚDE E EDUCAÇÃO */}
          <div className="space-y-6">
            <Section title="Saúde" icon={HeartPulse} color="bg-white">
              <div className="space-y-4 p-1">
                <InputField label="Última Visita Técnica" name="saude.ultima_consulta" type="date" register={register} />
                <label className="flex items-center gap-3 font-medium text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" {...register("saude.vacinas_em_dia")} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Vacinação Regular
                </label>
                <TagInput area="saude" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
              </div>
            </Section>

            <Section title="Educação" icon={GraduationCap} color="bg-white">
              <div className="space-y-4 p-1">
                <InputField label="Unidade de Ensino" name="educacao.escola" register={register} />
                <InputField label="Frequência (%)" name="educacao.frequencia_percent" type="number" register={register}/>
                <TagInput area="educacao" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
              </div>
            </Section>
          </div>

          {/* COLUNA 3: ASSISTÊNCIA */}
          <Section title="Social" icon={HandHelping} color="bg-white">
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 font-medium text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" {...register("assistencia.cad_unico")} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  CadÚnico Ativo
                </label>
                <label className="flex items-center gap-3 font-medium text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" {...register("assistencia.beneficio_ativo")} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Recebe Benefício
                </label>
              </div>
              <hr className="border-slate-100 my-2" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vulnerabilidades:</p>
              <TagInput area="assistencia" tags={currentAlertas} onAdd={handleAddTag} onRemove={handleRemoveTag} />
            </div>
          </Section>
        </div>

        {/* Botão de Submissão */}
        <div className="mt-12 flex justify-end">
          <button 
            type="submit"
            disabled={mutation.isPending}
            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {mutation.isPending ? (
               <span className="animate-pulse">Salvando...</span>
            ) : (
              <>
                <Save size={24} />
                Salvar Prontuário
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}