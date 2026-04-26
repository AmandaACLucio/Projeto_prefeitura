"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildren, deleteChild, reviewChild } from "@/services/children.service";
import { useRouter } from "next/navigation";
// Componentes que criamos
import FilterBar from "@/components/ui/filters/FilterBar";
import Pagination from "@/components/ui/navigation/Pagination";
import StatusBadge from "@/components/ui/table/StatusBadge";
import AlertBadge from "@/components/ui/table/AlertBadge";
import TableActions from "@/components/ui/table/TableActions";
import EmptyState from "@/components/ui/table/EmptyState";
import DeleteModal from "@/components/ui/modals/DeleteModal";

// Tipagens
import { FilterParams } from "@/types/filters";
import { Child, Alerta } from "@/types/child";

export default function ChildrenView() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. Estados de Controle
  const [filters, setFilters] = useState<FilterParams>({ search: "", bairro: "", status: "" });
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<{ id: string | number, nome: string } | null>(null);

  // 2. Busca de Dados (Tratando o objeto de retorno do service)
  const { data, isLoading, isPlaceholderData} = useQuery({
    queryKey: ["children", filters, page],
    queryFn: () => getChildren({ ...filters, page }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutos: os dados não ficam "velhos" instantaneamente
  });


  // 3. Mutações
  const deleteMutation = useMutation({
    mutationFn: deleteChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      setIsDeleteModalOpen(false);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: reviewChild,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["children"] }),
  });

  // Handlers
  const handleOpenDelete = (id: string | number, nome: string) => {
    setSelectedChild({ id, nome });
    setIsDeleteModalOpen(true);
  };

  const isInitialLoading = isLoading && !data;
  // 4. Guardião de Loading Inicial
  if (isInitialLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-gray-400 animate-pulse">
        Carregando base de dados da prefeitura...
      </div>
    );
  }

  // 5. Verificação de Dados Segura (Evita o erro de length)
  const hasData = data?.list && data.list.length > 0;
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        <header className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crianças Monitoradas</h1>
            <p className="text-sm text-gray-500">Gestão de alertas e revisões do município</p>
          </div>
        </header>

        {/* Filtros */}
        <FilterBar 
          onFilterChange={(newFilters) => { 
            setFilters(newFilters); 
            setPage(1); 
          }} 
        />

        {!hasData ? (
          <EmptyState onClear={() => setFilters({ search: "", bairro: "", status: "" })} />
        ) : (
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500 text-[11px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Criança / Responsável</th>
                  <th className="px-6 py-4 font-bold">Bairro</th>
                  <th className="px-6 py-4 font-bold text-center">Alertas ativos</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right pr-10">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.list.map((child: Child) => (
                  <tr key={child.id} className="hover:bg-blue-50/20 transition group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 group-hover:text-blue-700 transition">
                        {child.nome}
                      </p>
                      <p className="text-[11px] text-gray-400">{child.responsavel}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {child.bairro}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1 flex-wrap max-w-[200px] mx-auto">
                        {child.alertas.map((a: Alerta) => (
                          <AlertBadge key={a.id} variant={a.area}>
                            {a.tipo}
                          </AlertBadge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge revisado={child.revisado} />
                    </td>
                    <td className="px-6 py-4">
                      <TableActions 
                        id={child.id}
                        onView={(id) => router.push(`/children/${id}`)}
                        onEdit={(id) => console.log("Editar criança:", id)}
                        onDelete={() => handleOpenDelete(child.id, child.nome)}
                        onReview={(id) => reviewMutation.mutate(id)}
                        // Edit pode ser um modal ou nova página futuramente
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Navegação */}
            <div className="p-4 bg-gray-50/50 border-t">
              <Pagination 
                current={page} 
                total={data.totalPages} 
                onPageChange={setPage} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal de Exclusão */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        name={selectedChild?.nome}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedChild && deleteMutation.mutate(selectedChild.id)}
      />
    </div>
  );
}