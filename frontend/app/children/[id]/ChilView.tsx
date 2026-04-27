"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildById, reviewChild } from "@/services/children.service";
import { Edit3, ArrowLeft, CheckCircle } from "lucide-react";
import EditChildModal from "@/components/modals/EditChildModals";

export default function ChildView({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: child, isLoading } = useQuery({
    queryKey: ["child", id],
    queryFn: () => getChildById(id),
  });

  const mutation = useMutation({
    mutationFn: () => reviewChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["child", id] });
      alert("Marcado como revisado");
    },
  });

  if (isLoading && !child) return <div className="p-6 text-gray-500 font-black animate-pulse">CARREGANDO PRONTUÁRIO...</div>;
  if (!child) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. CABEÇALHO COM BOTÃO EDITAR */}
      <div className="bg-white border-4 border-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">{child.nome}</h1>
          <div className="flex gap-4 mt-2 text-[11px] font-black uppercase text-gray-500 italic">
            <p>📍 {child.bairro}</p>
            <p>👤 Responsável: {child.responsavel}</p>
            <p>👶 Nascimento: {new Date(child.data_nascimento).toLocaleDateString()}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-orange-500 text-white p-3 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Edit3 size={24} />
        </button>
      </div>

      {/* 2. GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Saúde */}
        <div className="border-4 border-gray-900 p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-sm mb-4 uppercase italic border-b-2 border-gray-900 pb-2 flex justify-between items-center">
            Saúde <div className={`w-3 h-3 rounded-full ${child.saude?.vacinas_em_dia ? 'bg-green-500' : 'bg-red-500'}`} />
          </h2>
          {child.saude ? (
            <div className="text-[12px] space-y-2 font-bold uppercase">
              <p className="flex justify-between border-b border-gray-100 pb-1 text-gray-500">
                Última consulta: <span className="text-gray-900">{new Date(child.saude?.ultima_consulta).toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                Vacinas: <span className={child.saude?.vacinas_em_dia ? "text-green-600" : "text-red-600"}>{child.saude?.vacinas_em_dia ? "EM DIA" : "PENDENTE"}</span>
              </p>
            </div>
          ) : <p className="text-[10px] italic">Sem dados</p>}
        </div>

        {/* Educação */}
        <div className="border-4 border-gray-900 p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-sm mb-4 uppercase italic border-b-2 border-gray-900 pb-2">Educação</h2>
          {child.educacao ? (
            <div className="text-[12px] space-y-2 font-bold uppercase">
              <p className="text-gray-500">Escola:</p>
              <p className="text-gray-900 truncate bg-gray-50 p-1 border border-gray-200">{child.educacao?.escola || "NÃO INFORMADA"}</p>
              <p className="flex justify-between pt-2">
                Frequência: <span className={child.educacao?.frequencia_percent < 75 ? "text-red-600" : "text-blue-600"}>{child.educacao?.frequencia_percent}%</span>
              </p>
            </div>
          ) : <p className="text-[10px] italic">Sem dados</p>}
        </div>

        {/* Assistência */}
        <div className="border-4 border-gray-900 p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-sm mb-4 uppercase italic border-b-2 border-gray-900 pb-2">Assistência Social</h2>
          {child.assistencia_social ? (
            <div className="text-[12px] space-y-2 font-bold uppercase">
              <p className="flex justify-between">CadÚnico: <span className="text-gray-900">{child.assistencia_social?.cad_unico ? "SIM" : "NÃO"}</span></p>
              <p className="flex justify-between">Benefício: <span className={child.assistencia_social?.beneficio_ativo ? "text-green-600" : "text-red-600"}>{child.assistencia_social?.beneficio_ativo ? "ATIVO" : "INATIVO"}</span></p>
            </div>
          ) : <p className="text-[10px] italic">Sem dados</p>}
        </div>
      </div>

      {/* 3. AÇÕES */}
      <div className="flex gap-4 pt-6 border-t-4 border-gray-900">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || child.revisado}
          className="flex-1 bg-green-500 text-white py-4 border-4 border-gray-900 font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={20} />
          {child.revisado ? "REVISÃO CONCLUÍDA" : "MARCAR COMO REVISADO"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-10 bg-white border-4 border-gray-900 font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> VOLTAR
        </button>
      </div>

      {isEditModalOpen && (
        <EditChildModal 
          child={child} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}