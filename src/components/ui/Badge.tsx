import React from 'react';
import { cn } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  pulse = false,
  className,
  icon
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
    blue: 'bg-sky-950/80 text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]',
    green: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
    red: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    slate: 'bg-slate-900/80 text-slate-300 border-slate-700/60',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/40'
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-mono tracking-wider',
    sm: 'text-xs px-2 py-0.5 font-mono tracking-wide',
    md: 'text-sm px-2.5 py-1 font-mono'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded border uppercase select-none transition-all',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
