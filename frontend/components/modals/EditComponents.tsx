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
  <div className={`p-5 border border-slate-200 rounded-xl ${color} h-fit`}>
    <h3 className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-5 border-b border-slate-100 pb-3">
      <Icon size={16} className="text-slate-400" /> {title}
    </h3>
    {children}
  </div>
);

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
  const errorMessage = error?.message?.toString();

  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5 ml-1">
        {label}
      </label>
      <input 
        {...register(name)} 
        {...props}
        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-700 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
      />
      {errorMessage && (
        <span className="text-red-500 text-[10px] font-medium mt-1 ml-1 block">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

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
      <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-white min-h-[45px] items-center focus-within:border-blue-400 transition-colors">
        {tags
          .filter((t) => t.area === area)
          .map((tag, i) => (
            <span 
              key={`${area}-${tag.tipo}-${i}`} 
              className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 uppercase transition-hover hover:bg-slate-200"
            >
              {tag.tipo}
              <button 
                type="button" 
                onClick={() => onRemove(tag.tipo, area)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        <input 
          placeholder="Adicionar alerta..."
          className="outline-none text-xs font-medium flex-1 min-w-[100px] bg-transparent text-slate-600 placeholder:text-slate-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};