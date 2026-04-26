interface StatusBadgeProps {
  revisado: boolean;
}

export default function StatusBadge({ revisado }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      revisado 
        ? "bg-green-100 text-green-700 border border-green-200" 
        : "bg-amber-100 text-amber-700 border border-amber-200"
    }`}>
      {revisado ? "Revisado" : "Pendente"}
    </span>
  );
}