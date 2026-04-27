"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildById, reviewChild } from "@/services/children.service";

export default function ChildView({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: child, isLoading } = useQuery({
    queryKey: ["child", id],
    queryFn: () => getChildById(id),
  });

  const mutation = useMutation({
    mutationFn: () => reviewChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      alert("Marcado como revisado");
      router.back();
    },
  });

  const isInitialLoading = isLoading && !child;
  // 4. Guardião de Loading Inicial
  if (isInitialLoading) return <div className="p-6 text-gray-500">Carregando...</div>;
  if (!child) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. CABEÇALHO (Largura total) */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{child.nome}</h1>
        <div className="flex gap-4 mt-2 text-gray-500 font-medium">
          <p>📍 {child.bairro}</p>
          <p>👤 Responsável: {child.responsavel}</p>
          <p>👶 Data de Nascimento: {new Date(child.data_nascimento).toLocaleDateString()}</p>
        </div>
      </div>

      {/* 2. GRID DE CARDS (Lado a lado no desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Saúde */}
        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-blue-600 border-b pb-2">Saúde</h2>
          {child.saude ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="flex justify-between">
                <span className="text-gray-500">Última consulta:</span>
                <span className="font-medium">{new Date(child.saude.ultima_consulta).toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Vacinas em dia:</span>
                <span className={child.saude.vacinas_em_dia ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {child.saude.vacinas_em_dia ? "Sim" : "Não"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Sem dados de saúde</p>
          )}
        </div>

        {/* Card Educação */}
        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-orange-600 border-b pb-2">Educação</h2>
          {child.educacao ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="text-gray-500">Escola:</p>
              <p className="font-medium truncate">{child.educacao.escola || "Não informado"}</p>
              <p className="flex justify-between pt-2">
                <span className="text-gray-500">Frequência:</span>
                <span className={`font-bold ${child.educacao.frequencia_percent < 75 ? "text-red-600" : "text-gray-900"}`}>
                  {child.educacao.frequencia_percent ?? "N/A"}%
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Sem dados de educação</p>
          )}
        </div>

        {/* Card Assistência (Corrigido para 'assistencia') */}
        <div className="border rounded-lg p-5 bg-white shadow-sm flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-purple-600 border-b pb-2">Assistência Social</h2>
          {child.assistencia_social ? (
            <div className="text-sm space-y-3 flex-grow">
              <p className="flex justify-between">
                <span className="text-gray-500">CadÚnico:</span>
                <span className="font-medium">{child.assistencia_social?.cad_unico ? "Sim" : "Não"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Benefício ativo:</span>
                <span className={child.assistencia_social?.beneficio_ativo ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {child.assistencia_social?.beneficio_ativo ? "Sim" : "Não"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Sem dados de assistência</p>
          )}
        </div>
      </div>

      {/* 3. BOTÕES (Embaixo) */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || child.revisado}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-md"
        >
          {child.revisado ? "Revisado" : mutation.isPending ? "Salvando..." : "Marcar como revisado"}
        </button>

        <button
          onClick={() => router.back()}
          className="border-2 border-gray-200 px-8 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}