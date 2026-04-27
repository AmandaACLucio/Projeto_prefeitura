import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Sincronizando dados...
      </p>
    </div>
  );
}