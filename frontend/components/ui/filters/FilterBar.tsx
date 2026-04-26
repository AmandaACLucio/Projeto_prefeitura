import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { FilterParams } from "@/types/filters";

interface FilterBarProps {
  onFilterChange: (filters: FilterParams) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [bairro, setBairro] = useState("");
  const [status, setStatus] = useState("");

  // Debounce: Só dispara o filtro 500ms após o usuário parar de digitar
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search, bairro, status });
    }, 500);
    return () => clearTimeout(handler);
  }, [search, bairro, status]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-3">
        <select 
          onChange={(e) => setBairro(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os Bairros</option>
          <option value="Rocinha">Rocinha</option>
          <option value="Bangu">Bangu</option>
        </select>

        <select 
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Status</option>
          <option value="true">Revisados</option>
          <option value="false">Revisão Pendente</option>
        </select>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por nome..." 
          className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
}