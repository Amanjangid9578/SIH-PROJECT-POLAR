import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AutomationRule } from '../../types';
import { formatTimeAgo, cn } from '../../utils/formatters';

interface AutomationCardProps {
  rule: AutomationRule;
  onToggle: (id: string) => void;
  onExecuteNow?: (rule: AutomationRule) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  rule,
  onToggle,
  onExecuteNow
}) => {
  const [expandedField, setExpandedField] = useState<'trigger' | 'condition' | 'action' | null>(null);

  const LogicChip: React.FC<{
    id: 'trigger' | 'condition' | 'action';
    label: string;
    value: string;
    valueClass: string;
  }> = ({ id, label, value, valueClass }) => {
    const expanded = expandedField === id;
    return (
      <button
        type="button"
        onClick={() => setExpandedField(expanded ? null : id)}
        title={value}
        className="w-full min-w-0 max-w-full bg-polar-900 border border-slate-700/60 rounded px-2.5 py-1.5 text-left overflow-hidden hover:border-cyan-500/40 transition-colors"
      >
        <span className="text-[9px] uppercase font-bold text-slate-500 block">{label}</span>
        <span
          className={cn(
            'text-[11px] font-mono block break-words',
            valueClass,
            expanded ? 'whitespace-normal' : 'truncate group-hover/chip:whitespace-normal group-hover/chip:break-words'
          )}
        >
          {value}
        </span>
      </button>
    );
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-5 font-mono text-left transition-all duration-200 select-none relative group',
        rule.enabled
          ? 'bg-polar-900/90 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.15)]'
          : 'bg-polar-950/60 border-slate-800 opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] uppercase font-bold px-2 py-0.5 rounded border',
                rule.category === 'INVENTORY' && 'bg-amber-950/80 text-amber-300 border-amber-500/40',
                rule.category === 'CARGO' && 'bg-sky-950/80 text-sky-300 border-sky-500/40',
                rule.category === 'PERSONNEL' && 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
                rule.category === 'EMERGENCY' && 'bg-rose-950/80 text-rose-300 border-rose-500/40',
                rule.category === 'WEATHER' && 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
              )}
            >
              {rule.category} RULE
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Executed {rule.executionCount} times
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {rule.title}
          </h3>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggle(rule.id)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border',
            rule.enabled
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900'
              : 'bg-polar-950 text-slate-500 border-slate-700 hover:text-slate-300'
          )}
          title={rule.enabled ? 'Click to deactivate rule' : 'Click to activate rule'}
        >
          {rule.enabled ? (
            <>
              <ToggleRight className="w-4 h-4 text-cyan-400" />
              <span>ENABLED</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4 text-slate-500" />
              <span>DISABLED</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
        {rule.description}
      </p>

      {/* Reactive Logic Chain: TRIGGER → CONDITION → ACTION */}
      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800/80 space-y-2 text-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 group/chip">
            <LogicChip id="trigger" label="TRIGGER" value={rule.trigger} valueClass="text-cyan-300 font-bold" />
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 self-center hidden sm:block mt-4" />

          <div className="flex-1 min-w-0 group/chip">
            <LogicChip id="condition" label="CONDITION" value={rule.condition} valueClass="text-amber-300" />
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 self-center hidden sm:block mt-4" />

          <div className="flex-1 min-w-0 group/chip">
            <LogicChip id="action" label="ACTION" value={rule.action} valueClass="text-emerald-300 font-bold" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Last Fired:{' '}
          <strong className="text-slate-300 font-mono">
            {rule.lastTriggered ? formatTimeAgo(rule.lastTriggered) : 'Standby'}
          </strong>
        </span>

        {onExecuteNow && (
          <button
            onClick={() => onExecuteNow(rule)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold uppercase text-[10px] hover:underline cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Test Trigger</span>
          </button>
        )}
      </div>
    </div>
  );
};
