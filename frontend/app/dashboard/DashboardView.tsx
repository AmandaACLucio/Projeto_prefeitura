"use client";

import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/services/sumary.service";
import Card from "@/components/ui/Card";

export default function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando dashboard...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total de crianças" value={data.total} />
        <Card title="Alertas Saúde" value={data.alertas.saude} />
        <Card title="Alertas Educação" value={data.alertas.educacao} />
        <Card title="Alertas Assistência" value={data.alertas.assistencia} />
        <Card title="Revisados" value={data.revisados} />
      </div>
    </div>
  );
}