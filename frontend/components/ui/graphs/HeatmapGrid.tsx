interface BairroStats {
  bairro: string;
  totalAlertas: number;
  saude: number;
  educacao: number;
  assistencia: number;
}

export default function HeatmapGrid({ data }: { data: BairroStats[] }) {
  // data deve ser algo como: [{ bairro: 'Centro', saude: 10, educacao: 5 }, ...]
  
const getIntensityClass = (value: number, type: 'saude' | 'educacao' | 'assistencia') => {
    if (value === 0) return 'bg-gray-50 text-gray-400'; // Estado neutro

    const colors = {
      // Tons de Amarelo/Laranja para Saúde
      saude: [
        { min: 20, class: 'bg-yellow-600 text-white' },
        { min: 5, class: 'bg-yellow-400 text-yellow-950' },
        { min: 1,  class: 'bg-yellow-100 text-yellow-800' },
      ],
      // Tons de Verde para Educação
      educacao: [
        { min: 20, class: 'bg-emerald-700 text-white' },
        { min: 5, class: 'bg-emerald-500 text-white' },
        { min: 1,  class: 'bg-emerald-100 text-emerald-800' },
      ],
      // Tons de Vermelho para Assistência
      assistencia: [
        { min: 20, class: 'bg-red-700 text-white' },
        { min: 5, class: 'bg-red-500 text-white' },
        { min: 1,  class: 'bg-red-100 text-red-800' },
      ],
    };

    const config = colors[type].find(c => value >= c.min);
    return config ? config.class : 'bg-gray-50 text-gray-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs uppercase text-gray-400">
            <th className="p-2 text-left">Bairro</th>
            <th className="p-2">Saúde</th>
            <th className="p-2">Educação</th>
            <th className="p-2">Assistência</th>
          </tr>
        </thead>
        <tbody>
        {data.map((b) => (
          <tr key={b.bairro} className="group hover:bg-gray-50 transition-colors">
            
            {/* Célula do Bairro com mais peso */}
            <td className="p-3 font-bold text-xs text-gray-800 border-b-4 border-gray-100/50 group-hover:text-gray-950 transition-colors">
              {b.bairro}
            </td>
            
            {/* 🩺 Célula Saúde - Tons de Amarelo */}
            <td className={`p-3 text-center text-xs font-black-800 border-b-4 border-gray-100/50 transition-all rounded-md scale-[0.98] hover:scale-100 ${getIntensityClass(b.saude, 'saude')}`}>
              {b.saude}
            </td>

            {/* 🎓 Célula Educação - Tons de Verde */}
            <td className={`p-3 text-center text-xs font-black-800 border-b-4 border-gray-100/50 transition-all rounded-md scale-[0.98] hover:scale-100 ${getIntensityClass(b.educacao, 'educacao')}`}>
              {b.educacao}
            </td>

            {/* ❤️ Célula Assistência - Tons de Vermelho */}
            <td className={`p-3 text-center text-xs font-black-800 border-b-4 border-gray-100/50 transition-all rounded-md scale-[0.98] hover:scale-100 ${getIntensityClass(b.assistencia, 'assistencia')}`}>
              {b.assistencia}
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}