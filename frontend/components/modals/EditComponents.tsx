import React, { useState, KeyboardEvent } from "react";
import { X, LucideIcon } from "lucide-react";
import { UseFormRegister, FieldErrors, Path, FieldValues } from "react-hook-form";

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  color: string;
}

export const Section = ({ title, icon: Icon, children, color }: SectionProps) => (
  <div className={`p-4 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${color} mb-6`}>
    <h3 className="flex items-center gap-2 font-black uppercase italic text-sm mb-4 border-b-2 border-gray-900 pb-2">
      <Icon size={18} /> {title}
    </h3>
    {children}
  </div>
);

// 2. Tipagem para o InputField (Zero Any usando FieldValues e Path)
interface InputFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>; 
  register: UseFormRegister<T>;
  error?: FieldErrors<T>[Path<T>]; 
}

export function InputField<T extends FieldValues>({ 
  label, 
  register, 
  name, 
  error, 
  ...props 
}: InputFieldProps<T>) {
  // Extraímos a mensagem de erro de forma segura sem 'any'
  const errorMessage = error?.message?.toString();

  return (
    <div className="mb-4">
      <label className="block text-[10px] font-black uppercase mb-1">{label}</label>
      <input 
        {...register(name)} 
        {...props}
        className="w-full border-2 border-gray-900 p-2 font-bold focus:bg-yellow-50 outline-none transition-colors" 
      />
      {errorMessage && (
        <span className="text-red-600 text-[10px] font-black mt-1 block italic">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

// 3. Tipagem para o TagInput (Zero Any)
interface Alerta {
  tipo: string;
  area: string;
}

interface TagInputProps {
  area: string;
  tags: Alerta[];
  onAdd: (tipo: string, area: string) => void;
  onRemove: (tipo: string, area: string) => void;
}

export const TagInput = ({ area, tags, onAdd, onRemove }: TagInputProps) => {
  const [text, setText] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (text.trim()) {
        onAdd(text.trim(), area);
        setText("");
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-900 bg-white min-h-[45px] items-center">
        {tags
          .filter((t) => t.area === area)
          .map((tag, i) => (
            <span 
              key={`${area}-${tag.tipo}-${i}`} 
              className="bg-gray-900 text-white px-2 py-0.5 text-[9px] font-black flex items-center gap-1 uppercase tracking-tighter"
            >
              {tag.tipo}
              <button 
                type="button" 
                onClick={() => onRemove(tag.tipo, area)}
                className="hover:text-red-400 transition-colors ml-1"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        <input 
          placeholder="Adicionar..."
          className="outline-none text-[10px] font-bold flex-1 min-w-[80px] bg-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};