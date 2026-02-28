import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = ({ label, error, icon, id, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-gray-400 text-xs font-bold uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          {...props}
          className={`
            w-full bg-white/5 border rounded-xl py-3 px-4 text-white text-sm
            placeholder-gray-600 focus:outline-none transition-all duration-300
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' : 'border-white/10 focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/20'}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="text-red-400 text-[10px] font-bold tracking-widest uppercase">{error}</p>
      )}
    </div>
  );
};

// ── Textarea variant ──

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, error, id, className = '', ...props }: TextareaProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-gray-400 text-xs font-bold uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        className={`
          w-full bg-white/5 border rounded-xl py-3 px-4 text-white text-sm
          placeholder-gray-600 focus:outline-none transition-all duration-300 resize-none
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#39ff14]'}
          ${className}
        `}
      />
      {error && (
        <p className="text-red-400 text-[10px] font-bold tracking-widest uppercase">{error}</p>
      )}
    </div>
  );
};

// ── Select variant ──

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const Select = ({
  label,
  error,
  id,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-gray-400 text-xs font-bold uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        className={`
          w-full bg-white/5 border rounded-xl py-3 px-4 text-gray-300 text-sm
          focus:outline-none transition-all duration-300
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#39ff14]'}
          ${className}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-[10px] font-bold tracking-widest uppercase">{error}</p>
      )}
    </div>
  );
};
