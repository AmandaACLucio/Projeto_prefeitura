"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildren, deleteChild, reviewChild } from "@/services/children.service";
import { useRouter } from "next/navigation";

// Componentes
import FilterBar from "@/components/ui/filters/FilterBar";
import Pagination from "@/components/ui/navigation/Pagination";
import StatusBadge from "@/components/ui/table/StatusBadge";
import AlertBadge from "@/components/ui/table/AlertBadge";
import TableActions from "@/components/ui/table/TableActions";
import EmptyState from "@/components/ui/table/EmptyState";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import EditChildModal from "@/components/modals/EditChildModals"; // Importe o novo modal
import LoadingState from "@/components/shared/LoadingState";

// Tipagens
import { FilterParams } from "@/types/filters";
import { Child, Alerta } from "@/types/child";

export default function ChildrenView() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterParams>({ search: "", bairro: "", status: "" });
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado do Modal de Edição
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["children", filters, page],
    queryFn: () => getChildren({ ...filters, page }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const listaBairros = useMemo(() => {
    if (!data?.list) return [];
      const uniqueBairros = Array.from(new Set(data?.list.map((c: Child) => c.bairro)));
      return uniqueBairros.sort();
    }, [data?.list]
  );

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
  const handleOpenDelete = (child: Child) => {
    setSelectedChild(child);
    setIsDeleteModalOpen(true);
  };

  const handleOpenEdit = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };

  const isInitialLoading = isLoading && !data;
  if (isInitialLoading) {
    return (
      <div>
        <LoadingState />
      </div>
    );
  }

  const hasData = data?.list && data.list.length > 0;
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        <header className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 uppercase italic">Crianças Monitoradas</h1>
            <p className="text-sm text-gray-500 font-medium">Gestão de alertas e revisões do município</p>
          </div>
        </header>

        <FilterBar 
          bairros={listaBairros} 
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
              <thead className="bg-gray-50 border-b font-black uppercase italic text-[11px] text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Criança / Responsável</th>
                  <th className="px-6 py-4">Bairro</th>
                  <th className="px-6 py-4 text-center">Alertas ativos</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right pr-10">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.list.map((child: Child) => (
                  <tr key={child.id} className="hover:bg-blue-50/20 transition group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 group-hover:text-blue-700 transition">
                        {child.nome}
                      </p>
                      <p className="text-[11px] text-gray-400 uppercase font-black tracking-tight">{child.responsavel}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold uppercase">
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
                        onEdit={() => handleOpenEdit(child)} 
                        onDelete={() => handleOpenDelete(child)}
                        onReview={(id) => reviewMutation.mutate(id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

      {/* Modais */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        name={selectedChild?.nome}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedChild && deleteMutation.mutate(selectedChild.id)}
      />

      {isEditModalOpen && (
        <EditChildModal 
          child={selectedChild} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedChild(null);
          }} 
        />
      )}
    </div>
  );
}