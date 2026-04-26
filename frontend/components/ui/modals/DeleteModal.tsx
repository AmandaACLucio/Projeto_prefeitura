interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  name?: string; // Interrogação pois pode ser undefined enquanto o modal abre
}

export default function DeleteModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  name 
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity">
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2">Excluir Registro?</h2>
        
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Você está prestes a excluir o registro de <strong className="text-gray-800">{name || "esta criança"}</strong>. 
          Esta ação é irreversível e removerá todos os alertas vinculados.
        </p>

        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-200 transition-all"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}