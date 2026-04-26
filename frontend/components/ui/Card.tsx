import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string; // Ex: "bg-[#00c0ef]" (Celeste), "bg-[#f39c12]" (Laranja)
  href?: string;
};

export default function Card({ title, value, icon, color, href }: Props) {
  return (
    <div className={`${color} rounded-md shadow-md text-white flex flex-col h-full relative group`}>
      {/* Parte Superior: Dados e Ícone */}
      <div className="p-4 flex justify-between items-center relative overflow-hidden">
        <div className="z-10">
          <h3 className="text-4xl font-bold mb-1">{value}</h3>
          <p className="text-sm font-medium whitespace-nowrap opacity-90 uppercase tracking-tight">
            {title}
          </p>
        </div>
        
        {/* Ícone estilizado no fundo à direita */}
        <div className="absolute right-2 top-4 opacity-20 transform scale-125 group-hover:scale-150 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {/* Parte Inferior: Link de ação */}
      <div className="mt-auto">
        {href ? (
          <Link 
            href={href} 
            className="flex items-center justify-center gap-1 py-1 bg-black/15 hover:bg-black/25 transition-colors text-xs text-white/90"
          >
            Ver Detalhes <ArrowRightCircle size={14} />
          </Link>
        ) : (
          <div className="py-1 bg-black/5 text-transparent select-none text-[10px]">.</div>
        )}
      </div>
    </div>
  );
}