"use client";

import { useQuery } from "@tanstack/react-query";
import { getSummary, getHistory, getHeatmap } from "@/services/sumary.service";
import Card from "@/components/ui/Card";
import { 
  Users, 
  Stethoscope, 
  GraduationCap, 
  HeartHandshake, 
  CheckCircle 
} from "lucide-react";

export default function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  const isInitialLoading = isLoading && !data;
  if (isInitialLoading) return <div className="p-8 animate-pulse text-blue-900 font-semibold">Sincronizando dados...</div>;
  if (!data) return null;

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Container que expande em telas ultra-wide */}
      <div className="max-w-[100%] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <Card 
            title="Total de crianças" 
            value={data.total} 
            color="bg-[#00c0ef]" // Azul Celeste
            icon={<Users size={64}/>} 
            href="/children" 
          />
          
          <Card 
            title="Alertas Saúde" 
            value={data.alertas.saude} 
            color="bg-[#f39c12]" // Laranja
            icon={<Stethoscope size={64} />}
            href="/children"
          />

          <Card 
            title="Alertas Educação" 
            value={data.alertas.educacao} 
            color="bg-[#00a65a]" // Verde
            icon={<GraduationCap size={64} />}
            href="/children"
          />

          <Card 
            title="Alertas Assistência" 
            value={data.alertas.assistencia} 
            color="bg-[#dd4b39]" // Vermelho
            icon={<HeartHandshake size={64} />}
            href="/children"
          />

          <Card 
            title="Revisados" 
            value={data.revisados} 
            color="bg-[#605ca8]" // Roxo/Cinza Escuro
            icon={<CheckCircle size={64} />}
          />

        </div>
      </div>
    </div>
  );
}