type BadgeProps = { children: React.ReactNode; variant: 'danger' | 'success' | 'warning' | 'info' };

export const TableAlerts = ({ children, variant }: BadgeProps) => {
  const styles = {
    danger: "bg-red-100 text-red-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`${styles[variant]} text-[10px] px-2 py-0.5 rounded font-bold uppercase`}>
      {children}
    </span>
  );
};