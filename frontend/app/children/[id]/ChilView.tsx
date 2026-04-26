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
      // atualiza cache da lista
      queryClient.invalidateQueries({ queryKey: ["children"] });

      alert("Marcado como revisado");
      router.back();
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando dados da criança...
      </div>
    );
  }

  if (!child) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border rounded-lg p-4">
        <h1 className="text-2xl font-bold">{child.nome}</h1>
        <p className="text-gray-500">{child.bairro}</p>
        <p className="text-sm text-gray-400">
          Responsável: {child.responsavel}
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-bold text-lg mb-2">Saúde</h2>

        {child.saude ? (
          <div className="text-sm space-y-1">
            <p>
              Última consulta:{" "}
              {new Date(child.saude.ultima_consulta).toLocaleDateString()}
            </p>

            <p>
              Vacinas em dia:{" "}
              <span
                className={
                  child.saude.vacinas_em_dia
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {child.saude.vacinas_em_dia ? "Sim" : "Não"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Sem dados de saúde</p>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-bold text-lg mb-2">Educação</h2>

        {child.educacao ? (
          <div className="text-sm space-y-1">
            <p>Escola: {child.educacao.escola || "Não informado"}</p>
            <p>
              Frequência:{" "}
              {child.educacao.frequencia_percent ?? "N/A"}%
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Sem dados de educação</p>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-bold text-lg mb-2">Assistência Social</h2>

        {child.assistencia_social ? (
          <div className="text-sm space-y-1">
            <p>
              CadÚnico:{" "}
              {child.assistencia_social.cad_unico ? "Sim" : "Não"}
            </p>

            <p>
              Benefício ativo:{" "}
              <span
                className={
                  child.assistencia_social.beneficio_ativo
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {child.assistencia_social.beneficio_ativo ? "Sim" : "Não"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Sem dados de assistência</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Salvando..." : "Marcar como revisado"}
        </button>

        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}