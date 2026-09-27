import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Flag,
  Calendar
} from 'lucide-react';
import { Milestone } from '../../types';
import { cn } from '../../utils/formatters';

interface ExpeditionTimelineProps {
  milestones: Milestone[];
  onUpdateMilestones: (updated: Milestone[]) => void;
}

export const ExpeditionTimeline: React.FC<ExpeditionTimelineProps> = ({
  milestones,
  onUpdateMilestones
}) => {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStation, setNewStation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleStatusChange = (id: string, newStatus: Milestone['status']) => {
    const updated = milestones.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: newStatus,
          actualDate: newStatus === 'COMPLETED' ? new Date().toISOString().substring(0, 10) : m.actualDate
        };
      }
      return m;
    });
    onUpdateMilestones(updated);
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateMilestones(milestones.filter(m => m.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: Milestone = {
      id: `ms-${Date.now()}`,
      title: newTitle.trim(),
      stationOrPhase: newStation.trim() || 'Field Operations',
      scheduledDate: newDate || new Date().toISOString().substring(0, 10),
      status: 'PENDING',
      description: newDesc.trim() || 'Scheduled expedition operational phase'
    };

    onUpdateMilestones([...milestones, newM]);
    setNewTitle('');
    setNewStation('');
    setNewDate('');
    setNewDesc('');
    setIsAddingMilestone(false);
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase font-bold flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>In Progress</span>
          </span>
        );
      case 'DELAYED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-300 border border-rose-500/40 uppercase font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Delayed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-700 uppercase font-bold flex items-center gap-1">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-polar-900/90 border border-slate-800 rounded-xl p-5 font-mono text-left select-none">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Flag className="w-4 h-4 text-cyan-400" />
            <span>Interactive Operational Milestones</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Planning → Departure → Transit → Station Arrival → Research Ops → Resupply → Return
          </p>
        </div>

        <button
          onClick={() => setIsAddingMilestone(!isAddingMilestone)}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add Milestone Inline Form */}
      {isAddingMilestone && (
        <form onSubmit={handleAddMilestone} className="mb-6 p-4 rounded-lg bg-polar-950 border border-cyan-500/40 space-y-3">
          <div className="text-xs font-bold text-cyan-300 uppercase">New Milestone Specification</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Milestone Title (e.g. Ice Core Campaign)"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="bg-polar-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Location/Station (e.g. Bharati Station)"
              value={newStation}
              onChange={e => setNewStation(e.target.value)}
              className="bg-polar-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="bg-polar-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <textarea
            placeholder="Operational description and milestone objective details..."
            rows={2}
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full bg-polar-900 border border-slate-700 rounded p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingMilestone(false)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6">
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative group">
            {/* Step Circle Node */}
            <div
              className={cn(
                'absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 transition-all',
                m.status === 'COMPLETED' && 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                m.status === 'IN_PROGRESS' && 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse',
                m.status === 'DELAYED' && 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
                m.status === 'PENDING' && 'bg-polar-900 border-slate-600'
              )}
            />

            {/* Card Content */}
            <div className="p-3.5 rounded-lg bg-polar-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-cyan-400">PHASE 0{idx + 1}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-bold text-slate-100">{m.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(m.status)}
                  <select
                    value={m.status}
                    onChange={e => handleStatusChange(m.id, e.target.value as Milestone['status'])}
                    className="bg-polar-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none focus:border-cyan-400"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-polar-800 transition-colors"
                    title="Remove milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">{m.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                <span className="flex items-center gap-1">
                  <Flag className="w-3 h-3 text-cyan-400" />
                  <span>Sector: <strong className="text-slate-300">{m.stationOrPhase}</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Target Date: <strong className="text-slate-300">{m.scheduledDate}</strong></span>
                </span>
                {m.actualDate && (
                  <span className="text-emerald-400 font-bold">
                    Completed: {m.actualDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
