import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositiveChange?: boolean;
  contextText: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'blue' | 'amber' | 'red' | 'green';
  targetRoute?: string;
  isAlert?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositiveChange = true,
  contextText,
  icon: Icon,
  variant = 'cyan',
  targetRoute,
  isAlert = false
}) => {
  const navigate = useNavigate();

  const variantStyles = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400 bg-polar-900/90 text-cyan-400 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.15)]',
    blue: 'border-sky-500/30 hover:border-sky-400 bg-polar-900/90 text-sky-400 shadow-[0_4px_20px_-4px_rgba(56,189,248,0.15)]',
    amber: 'border-amber-500/30 hover:border-amber-400 bg-polar-900/90 text-amber-400 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.15)]',
    red: 'border-rose-500/50 hover:border-rose-400 bg-rose-950/30 text-rose-400 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.25)]',
    green: 'border-emerald-500/30 hover:border-emerald-400 bg-polar-900/90 text-emerald-400 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]'
  };

  return (
    <div
      onClick={() => targetRoute && navigate(targetRoute)}
      className={cn(
        'relative rounded-xl border p-4 transition-all duration-200 text-left font-mono select-none group',
        targetRoute && 'cursor-pointer hover:-translate-y-0.5',
        variantStyles[variant],
        isAlert && 'animate-pulse'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-polar-950/80 border border-slate-800 text-current transition-transform group-hover:scale-110">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric */}
      <div className="flex items-baseline justify-between gap-2 mt-1 min-w-0">
        <span className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight truncate min-w-0">
          {value}
        </span>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 max-w-[50%]',
              isPositiveChange
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
            )}
          >
            {isPositiveChange ? (
              <TrendingUp className="w-3 h-3 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 shrink-0" />
            )}
            <span className="truncate">{change}</span>
          </div>
        )}
      </div>

      {/* Contextual Subtitle */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[11px] text-slate-400 min-w-0">
        <span className="truncate min-w-0">{contextText}</span>
        {targetRoute && (
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
        )}
      </div>
    </div>
  );
};
