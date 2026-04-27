"use client";

import { useQuery } from "@tanstack/react-query";
import { getSummary, getHistory, getHeatmap } from "@/services/sumary.service";
import Card from "@/components/ui/Card";
import HistoricalStepChart from "@/components/ui/graphs/HistoricalStepChart";
import HeatmapGrid from "@/components/ui/graphs/HeatmapGrid";
import { 
  Users, 
  Stethoscope, 
  GraduationCap, 
  HeartHandshake, 
  CheckCircle 
} from "lucide-react";

export default function DashboardView() {

  const { data: summary, isLoading : loadingSummary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  const { data: historyLogs, isLoading: loadingHistory } = useQuery({
    queryKey: ["history-logs"],
    queryFn: () => getHistory(20),
  });

  const { data: bairroStats, isLoading: loadingBairros } = useQuery({
    queryKey: ["bairro-stats"],
    queryFn: getHeatmap,
  });

  const isAnyLoading = loadingSummary || loadingHistory || loadingBairros;

  //const isInitialLoading = isLoading && !data;
  if (isAnyLoading) return <div className="p-8 animate-pulse text-blue-900 font-semibold">Sincronizando dados...</div>;
  if (!summary) return null;

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Container que expande em telas ultra-wide */}
      <div className="max-w-[100%] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <Card 
            title="Total de crianças" 
            value={summary.total} 
            color="bg-[#00c0ef]" // Azul Celeste
            icon={<Users size={64}/>} 
            href="/children" 
          />
          
          <Card 
            title="Alertas Saúde" 
            value={summary.alertas.saude} 
            color="bg-[#f39c12]" // Laranja
            icon={<Stethoscope size={64} />}
            href="/children"
          />

          <Card 
            title="Alertas Educação" 
            value={summary.alertas.educacao} 
            color="bg-[#00a65a]" // Verde
            icon={<GraduationCap size={64} />}
            href="/children"
          />

          <Card 
            title="Alertas Assistência" 
            value={summary.alertas.assistencia} 
            color="bg-[#dd4b39]" // Vermelho
            icon={<HeartHandshake size={64} />}
            href="/children"
          />

          <Card 
            title="Revisados" 
            value={summary.revisados} 
            color="bg-[#605ca8]" // Roxo/Cinza Escuro
            icon={<CheckCircle size={64} />}
          />

        </div>
        {/* Container dos Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Card do Gráfico de Evolução */}
          <div className="bg-white p-4 border-2 border-gray-200 shadow-md] rounded-xl">
            <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">
              Evolução de Alertas (Snapshots)
            </h3>
            <HistoricalStepChart logs={historyLogs ?? []} />
          </div>

          {/* Card do Heatmap por Bairro */}
          <div className="bg-white p-4 border-2 border-gray-200 shadow-md] rounded-xl overflow-hidden">
            <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">
              Densidade por Bairro
            </h3>
            <div className="max-h-[300px] overflow-y-auto"> {/* Scroll interno se a lista for longa */}
              <HeatmapGrid data={bairroStats ?? []} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}