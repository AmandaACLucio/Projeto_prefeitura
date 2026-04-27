"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface HistoryLog {
  tipo: string;
  valor: number;
  criado_em: string;
}

export default function HistoricalStepChart({ logs }: { logs: HistoryLog[] }) {
  const data = {
    labels: logs.map(l => new Date(l.criado_em).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })),
    datasets: [
      {
        label: 'Educação',
        data: logs.map(l => l.tipo === 'alertas_educacao' ? l.valor : null),
        borderColor: '#f97316',
        backgroundColor: '#f97316', // Adicionado para a cor do círculo na legenda
        stepped: true,
        spanGaps: true,
        pointStyle: 'circle', // Garante que o estilo seja círculo
      },
      {
        label: 'Saúde',
        data: logs.map(l => l.tipo === 'alertas_saude' ? l.valor : null),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        stepped: true,
        spanGaps: true,
        pointStyle: 'circle',
      },
      {
        label: 'Assistência',
        data: logs.map(l => l.tipo === 'alertas_assistencia' ? l.valor : null),
        borderColor: '#5aeb25',
        backgroundColor: '#5aeb25',
        stepped: true,
        spanGaps: true,
        pointStyle: 'circle',
      },
      {
        label: 'Total de Crianças',
        data: logs.map(l => l.tipo === 'total_criancas' ? l.valor : null),
        borderColor: '#111827',
        backgroundColor: '#111827',
        borderWidth: 3,
        stepped: true,
        spanGaps: true,
        pointStyle: 'circle',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true, // 👈 Faz a legenda usar o estilo do ponto (círculo)
          pointStyle: 'circle', // 👈 Força ser um círculo
          padding: 20, // Espaçamento entre os itens da legenda
          boxWidth: 10, // Tamanho do círculo
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    }
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}