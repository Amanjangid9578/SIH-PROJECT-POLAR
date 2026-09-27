import React from 'react';
import { cn } from '../../utils/formatters';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400 active:scale-[0.98]',
    secondary:
      'bg-polar-800 hover:bg-polar-750 text-sky-200 border border-sky-500/30 hover:border-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.4)] active:scale-[0.98]',
    danger:
      'bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-polar-800/60 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-polar-800/50 text-slate-400 hover:text-slate-100 border border-transparent',
    amber:
      'bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.3)] border border-amber-400 active:scale-[0.98]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-md gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-medium'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
