import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Clock,
  MapPin,
  Users,
  Radio,
  CheckCircle2,
  Send,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmergencyIncident, EmergencySeverity, EmergencyStatus } from '../types';
import { DeclareEmergencyModal } from '../components/emergency/DeclareEmergencyModal';
import { ResolveEmergencyModal } from '../components/emergency/ResolveEmergencyModal';
import { PolarMap } from '../components/maps/PolarMap';
import { formatTimeAgo, formatCoordinates, cn } from '../utils/formatters';

export const EmergencyPage: React.FC = () => {
  const {
    emergencies,
    updateEmergencyStatus,
    addEmergencyTimelineEvent,
    personnel,
    cargo
  } = useApp();

  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [incidentToResolve, setIncidentToResolve] = useState<EmergencyIncident | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    emergencies[0]?.id || ''
  );
  const [newTimelineNote, setNewTimelineNote] = useState('');
  const [timelineAuthor, setTimelineAuthor] = useState('Dr. R. Nair (Mission Director)');

  const activeIncidents = emergencies.filter(e => e.status !== 'RESOLVED');
  const resolvedIncidents = emergencies.filter(e => e.status === 'RESOLVED');

  const selectedIncident = emergencies.find(e => e.id === selectedIncidentId) || emergencies[0];

  const handleAddTimelineEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineNote.trim() || !selectedIncident) return;

    addEmergencyTimelineEvent(
      selectedIncident.id,
      timelineAuthor,
      newTimelineNote.trim(),
      'Situation report updated'
    );
    setNewTimelineNote('');
  };

  const getSeverityBadge = (sev: EmergencySeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded text-xs bg-rose-950 text-rose-200 border border-rose-500 font-black animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]">
            CRITICAL SEVERITY
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded text-xs bg-amber-950 text-amber-300 border border-amber-500 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            HIGH SEVERITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded text-xs bg-sky-950 text-sky-300 border border-sky-500 font-bold">
            MEDIUM SEVERITY
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 rounded text-xs bg-slate-900 text-slate-400 border border-slate-700 font-bold">
            LOW SEVERITY
          </span>
        );
    }
  };

  const getStatusBadge = (st: EmergencyStatus) => {
    switch (st) {
      case 'RESPONSE ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500 font-bold uppercase flex items-center gap-1">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Response Active</span>
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500 font-bold uppercase">
            Acknowledged
          </span>
        );
      case 'CREATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700 font-bold uppercase">
            Dispatched
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Resolved</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Emergency Command Center & Tactical SAR Response
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time disaster management, Search & Rescue coordination, casualty evacuation, and contingency escalation
          </p>
        </div>

        {/* Declare Emergency CTA */}
        <button
          onClick={() => setIsDeclareModalOpen(true)}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>DECLARE EMERGENCY</span>
        </button>
      </div>

      {/* Mini Threat Map */}
      <div className="rounded-xl overflow-hidden border border-rose-500/40 bg-polar-900">
        <PolarMap className="h-[280px]" />
      </div>

      {/* Main Grid: Active Incidents List vs Selected Incident Detailed Command Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Active Incidents Roster (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Active Incidents ({activeIncidents.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500">SEVERITY PRIORITY QUEUE</span>
          </div>

          <div className="space-y-3">
            {activeIncidents.length === 0 ? (
              <div className="p-8 rounded-xl bg-polar-900/60 border border-slate-800 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-slate-200">Zero Active Emergency Incidents</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  All Antarctic research stations and traverse teams report nominal conditions.
                </p>
              </div>
            ) : (
              activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer relative group text-left space-y-2',
                    selectedIncident?.id === inc.id
                      ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                      : 'bg-polar-900/90 border-slate-800 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 tracking-wider">
                      {inc.incidentCode}
                    </span>
                    {getStatusBadge(inc.status)}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                    {inc.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                    {inc.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="truncate max-w-[160px]">{inc.locationName}</span>
                    </span>
                    <span className="font-bold text-rose-400">{inc.severity}</span>
                  </div>
                </div>
              ))
            )}

            {/* Resolved Incidents Accordion Section */}
            {resolvedIncidents.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Archived / Resolved Incidents ({resolvedIncidents.length})
                </span>
                {resolvedIncidents.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedIncidentId(r.id)}
                    className="p-3 rounded-lg bg-polar-950 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs space-y-1 opacity-70 hover:opacity-100 transition-all"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold">{r.incidentCode}</span>
                      <span className="text-emerald-400 font-bold">RESOLVED</span>
                    </div>
                    <div className="font-bold text-slate-200">{r.title}</div>
                    <div className="text-[10px] text-slate-500">Cleared: {r.resolvedAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Incident Command Console (7 Cols) */}
        {selectedIncident ? (
          <div className="lg:col-span-7 rounded-xl bg-polar-900/90 border border-slate-800 p-5 space-y-5">
            {/* Incident Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-400 font-bold">{selectedIncident.incidentCode}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300">{selectedIncident.category}</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-100 uppercase">
                  {selectedIncident.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {getSeverityBadge(selectedIncident.severity)}
                {selectedIncident.status !== 'RESOLVED' && (
                  <button
                    onClick={() => setIncidentToResolve(selectedIncident)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            </div>

            {/* Incident Details Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Location & Perimeter</span>
                <p className="font-bold text-slate-200">{selectedIncident.locationName}</p>
                <span className="text-[10px] text-cyan-400">
                  {formatCoordinates(selectedIncident.coords.lat, selectedIncident.coords.lng)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">SAR Response Team</span>
                <p className="font-bold text-sky-300">{selectedIncident.assignedResponseTeam}</p>
                <span className="text-[10px] text-slate-400">Lead: {selectedIncident.leadResponder}</span>
              </div>

              <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Affected Personnel</span>
                <p className="font-bold text-rose-300">
                  {selectedIncident.affectedPersonnelIds.length > 0
                    ? `${selectedIncident.affectedPersonnelIds.length} Person(s) At Risk`
                    : 'None Reported'}
                </p>
                <span className="text-[10px] text-slate-500">
                  Reported: {formatTimeAgo(selectedIncident.reportedAt)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-lg bg-polar-950/80 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
              <strong className="block text-slate-200 font-mono text-xs uppercase mb-1">
                Incident Situation Summary:
              </strong>
              {selectedIncident.description}
            </div>

            {/* Chronological Action Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Incident Response Action Log & Comms Log
              </span>

              <div className="border-l-2 border-slate-800 ml-2 pl-4 space-y-4 text-xs max-h-60 overflow-y-auto pr-2">
                {selectedIncident.timeline.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-400">{evt.author}</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-200 font-sans mt-0.5">{evt.note}</div>
                    {evt.actionTaken && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Action Taken: {evt.actionTaken}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Action Event Form */}
              {selectedIncident.status !== 'RESOLVED' && (
                <form
                  onSubmit={handleAddTimelineEntry}
                  className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-2 mt-4"
                >
                  <span className="text-[11px] font-bold text-slate-300 uppercase block">
                    Transmit Response Update / Debrief
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Log dispatch update, radio telemetry, or medical vitals..."
                      value={newTimelineNote}
                      onChange={e => setNewTimelineNote(e.target.value)}
                      className="flex-1 bg-polar-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Event</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 py-20 text-center text-slate-500 text-xs">
            Select an incident from the left queue to inspect tactical timeline and dispatch response teams.
          </div>
        )}
      </div>

      {/* Modals */}
      <DeclareEmergencyModal
        isOpen={isDeclareModalOpen}
        onClose={() => setIsDeclareModalOpen(false)}
      />
      <ResolveEmergencyModal
        isOpen={Boolean(incidentToResolve)}
        onClose={() => setIncidentToResolve(null)}
        incident={incidentToResolve}
      />
    </div>
  );
};
