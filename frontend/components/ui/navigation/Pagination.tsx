import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ current, total, onPageChange }: PaginationProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
      <span className="text-sm text-gray-500">
        Página <span className="font-semibold">{current}</span> de <span className="font-semibold">{total}</span>
      </span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="p-2 border rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16}/>
        </button>
        
        <span className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold">
          {current}
        </span>

        <button 
          onClick={() => onPageChange(current + 1)}
          disabled={current === total}
          className="p-2 border rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );
}