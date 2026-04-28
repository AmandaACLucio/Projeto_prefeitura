interface AlertBadgeProps {
  children: React.ReactNode;
  variant: "saude" | "educacao" | "assistencia" | string;
}

export default function AlertBadge({ children, variant }: AlertBadgeProps) {
  const styles: Record<string, string> = {
    saude: "bg-orange-100 text-orange-700 border-orange-200",
    educacao: "bg-green-100 text-green-700 border-green-200",
    assistencia: "bg-red-100 text-red-700 border-red-200",
    default: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <span className={`
      px-2 py-0.5 
      rounded-md 
      text-[10px] 
      font-bold 
      uppercase 
      border
      whitespace-nowrap
      ${currentStyle}
    `}>
      {children}
    </span>
  );
}