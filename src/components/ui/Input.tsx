import React from 'react';
import { cn } from '../../utils/formatters';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={generatedId}
          className={cn(
            'w-full bg-polar-900 border border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400 font-mono">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  id,
  ...props
}) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        id={generatedId}
        className={cn(
          'w-full bg-polar-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono cursor-pointer',
          error && 'border-rose-500',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-polar-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}
    </div>
  );
};
