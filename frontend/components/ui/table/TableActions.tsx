import { Eye, Edit, Trash2, CheckCircle } from "lucide-react";

interface TableActionsProps {
  id: string | number;
  onView: (id: string | number) => void;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onReview: (id: string | number) => void;
}
export default function TableActions ({ id, onReview, onEdit, onDelete, onView } : TableActionsProps){ 
  return (
  <div className="flex justify-end gap-3 text-gray-400">
    <button onClick={() => onView(id)} className="hover:text-blue-600 transition"><Eye size={18} /></button>
    <button onClick={() => onReview(id)} className="hover:text-green-600 transition"><CheckCircle size={18} /></button>
    <button onClick={() => onEdit(id)} className="hover:text-orange-500 transition"><Edit size={18} /></button>
    <button onClick={() => onDelete(id)} className="hover:text-red-600 transition"><Trash2 size={18} /></button>
  </div>
);}