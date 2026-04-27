"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildById, reviewChild } from "@/services/children.service";
import { Edit3 } from "lucide-react";
import EditChildModal from "@/components/modals/EditChildModals";
import LoadingState from "@/components/shared/LoadingState";

export default function ChildView({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: child, isLoading } = useQuery({
    queryKey: ["child", id],
    queryFn: () => getChildById(id),
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: () => reviewChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["child", id] });
      alert("Marcado como revisado");
    },
  });

  if (isLoading && !child) return (
    <div>
      <LoadingState />
    </div>
  );

  if (!child) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* CABEÇALHO */}
      <div className="bg-white border rounded-lg p-6 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{child.nome}</h1>
          <div className="flex gap-4 mt-2 text-gray-500 font-medium text-sm">
            <p>📍 {child.bairro}</p>
            <p>👤 Responsável: {child.responsavel}</p>
            <p>👶 Data de Nascimento: {new Date(child.data_nascimento).toLocaleDateString()}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
        >
          <Edit3 size={18} /> Editar
        </button>
      </div>

      {/* GRID DE CARDS ORIGINAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-blue-600 border-b pb-2">Saúde</h2>
          {child.saude ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="flex justify-between">
                <span className="text-gray-500">Última consulta:</span>
                <span className="font-medium">{new Date(child.saude?.ultima_consulta).toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Vacinas em dia:</span>
                <span className={child.saude?.vacinas_em_dia ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {child.saude?.vacinas_em_dia ? "Sim" : "Não"}
                </span>
              </p>
            </div>
          ) : <p className="text-gray-400 italic">Sem dados de saúde</p>}
        </div>

        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-orange-600 border-b pb-2">Educação</h2>
          {child.educacao ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="text-gray-500">Escola:</p>
              <p className="font-medium truncate">{child.educacao?.escola || "Não informado"}</p>
              <p className="flex justify-between pt-2">
                <span className="text-gray-500">Frequência:</span>
                <span className={`font-bold ${child.educacao?.frequencia_percent < 75 ? "text-red-600" : "text-gray-900"}`}>
                  {child.educacao?.frequencia_percent ?? "N/A"}%
                </span>
              </p>
            </div>
          ) : <p className="text-gray-400 italic">Sem dados de educação</p>}
        </div>

        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-purple-600 border-b pb-2">Assistência Social</h2>
          {child.assistencia ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="flex justify-between">
                <span className="text-gray-500">CadÚnico:</span>
                <span className="font-medium">{child.assistencia?.cad_unico ? "Sim" : "Não"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Benefício ativo:</span>
                <span className={child.assistencia?.beneficio_ativo ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {child.assistencia?.beneficio_ativo ? "Sim" : "Não"}
                </span>
              </p>
            </div>
          ) : <p className="text-gray-400 italic">Sem dados de assistência</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || child.revisado}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-md"
        >
          {child.revisado ? "Revisado" : mutation.isPending ? "Salvando..." : "Marcar como revisado"}
        </button>
        <button onClick={() => router.back()} className="border-2 border-gray-200 px-8 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all">
          Voltar
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