import { SearchX } from "lucide-react";

export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <SearchX size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">Nenhuma criança encontrada</h3>
      <p className="text-gray-500 text-sm mb-6">Tente ajustar seus filtros para encontrar o que procura.</p>
      <button 
        onClick={onClear}
        className="text-blue-600 font-semibold text-sm hover:underline"
      >
        Limpar todos os filtros
      </button>
    </div>
  );
}