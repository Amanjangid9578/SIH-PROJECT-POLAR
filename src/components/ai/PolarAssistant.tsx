import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  Box,
  Layers,
  Ship,
  Users,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatWeight, cn } from '../../utils/formatters';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  actionRoute?: string;
  actionLabel?: string;
  dataSnippet?: {
    title: string;
    items: string[];
    badge?: string;
    badgeColor?: 'red' | 'amber' | 'cyan' | 'green';
  };
}

interface PolarAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolarAssistant: React.FC<PolarAssistantProps> = ({ isOpen, onClose }) => {
  const {
    cargo,
    inventory,
    personnel,
    emergencies,
    vessels,
    stations,
    activeExpedition
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Greetings Commander. I am POLAR AI, your mission-support intelligence core. I have direct access to station telemetry, vessel AIS feeds, cargo manifests, personnel safety monitors, and active emergency logs. How may I assist your polar operations today?',
      dataSnippet: {
        title: 'Telemetry Overview',
        items: [
          `Active Expedition: ${activeExpedition?.name || 'ISEA-45'}`,
          `Vessels Underway: ${vessels.filter(v => v.status === 'UNDERWAY').length}`,
          `Active Emergencies: ${emergencies.filter(e => e.status !== 'RESOLVED').length}`,
          `Critical Alerts: ${inventory.filter(i => i.quantity <= i.reorderThreshold).length} low stock items`
        ],
        badge: 'LIVE SYNCHRONIZED',
        badgeColor: 'cyan'
      }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const generateDeterministicAnswer = (query: string): Message => {
    const q = query.toLowerCase().trim();

    // 1. Delayed Cargo
    if (q.includes('cargo') && (q.includes('delay') || q.includes('late') || q.includes('status'))) {
      const delayed = cargo.filter(c => c.status === 'Delayed');
      const inTransit = cargo.filter(c => c.status === 'In Transit');

      if (delayed.length === 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Now',
          text: `Good news Commander. All ${cargo.length} tracked cargo items are currently moving on schedule. There are ${inTransit.length} shipments actively in transit across the Southern Ocean.`,
          actionRoute: '/cargo',
          actionLabel: 'Inspect Cargo Board'
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Inspection complete. There are currently ${delayed.length} delayed cargo shipments detected in transit:`,
        dataSnippet: {
          title: 'Delayed Shipments',
          items: delayed.map(
            d => `${d.trackingNumber}: ${d.description} (Bound for ${d.destination}) — ETA: ${new Date(d.eta).toLocaleDateString()}`
          ),
          badge: `${delayed.length} SHIPMENT(S) DELAYED`,
          badgeColor: 'amber'
        },
        actionRoute: '/cargo',
        actionLabel: 'View Delayed Cargo'
      };
    }

    // 2. Low Inventory / Stock
    if (q.includes('inventory') || q.includes('stock') || q.includes('replenish') || q.includes('supply')) {
      const lowStock = inventory.filter(i => i.quantity <= i.reorderThreshold);
      const criticalStock = inventory.filter(i => i.quantity <= i.reorderThreshold * 0.5);

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Telemetry scan across all polar research stations identified ${lowStock.length} items below safe reorder thresholds (${criticalStock.length} critically depleted).`,
        dataSnippet: {
          title: 'Reorder Recommendations',
          items: lowStock.map(
            item => `${item.name} (${item.stationId.replace('st-', '').toUpperCase()}): Current ${item.quantity} ${item.unit} vs Threshold ${item.reorderThreshold} ${item.unit}`
          ),
          badge: criticalStock.length > 0 ? 'CRITICAL DEFICIT' : 'REORDER REQUIRED',
          badgeColor: criticalStock.length > 0 ? 'red' : 'amber'
        },
        actionRoute: '/inventory',
        actionLabel: 'Open Inventory & Smart Reorder'
      };
    }

    // 3. Emergencies / Incidents
    if (q.includes('emergency') || q.includes('incident') || q.includes('alarm') || q.includes('danger') || q.includes('alert')) {
      const active = emergencies.filter(e => e.status !== 'RESOLVED');
      const critical = active.filter(e => e.severity === 'CRITICAL');

      if (active.length === 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Now',
          text: 'Negative. No active emergency incidents currently logged. All stations and traverse teams report nominal conditions.',
          actionRoute: '/emergency',
          actionLabel: 'Open Emergency Dashboard'
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Attention Commander: There are ${active.length} active emergency incidents registered (${critical.length} CRITICAL). Response units are engaged.`,
        dataSnippet: {
          title: 'Active Incidents',
          items: active.map(
            e => `[${e.severity}] ${e.incidentCode}: ${e.title} (${e.locationName}) — Status: ${e.status}`
          ),
          badge: critical.length > 0 ? 'CRITICAL INCIDENTS' : 'ACTIVE ALERTS',
          badgeColor: critical.length > 0 ? 'red' : 'amber'
        },
        actionRoute: '/emergency',
        actionLabel: 'Go to Emergency Command'
      };
    }

    // 4. Personnel
    if (q.includes('personnel') || q.includes('people') || q.includes('crew') || q.includes('deployed') || q.includes('team')) {
      const overdue = personnel.filter(p => p.checkInOverdue);
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Currently ${personnel.length} scientists and logistical operators are deployed across Antarctic field sectors. ${overdue.length > 0 ? `WARNING: ${overdue.length} personnel check-in timer(s) are overdue!` : 'All personnel check-ins are up to date.'}`,
        dataSnippet: {
          title: 'Personnel Summary',
          items: [
            `Active in Field/Station: ${personnel.filter(p => p.status === 'ACTIVE').length}`,
            `In Maritime/Air Transit: ${personnel.filter(p => p.status === 'IN TRANSIT').length}`,
            overdue.length > 0 ? `Overdue Alert: ${overdue.map(o => o.name).join(', ')}` : 'Overdue check-ins: None'
          ],
          badge: overdue.length > 0 ? 'CHECK-IN OVERDUE' : 'ALL NOMINAL',
          badgeColor: overdue.length > 0 ? 'red' : 'green'
        },
        actionRoute: '/personnel',
        actionLabel: 'View Personnel Roster'
      };
    }

    // 5. Vessels / AIS
    if (q.includes('vessel') || q.includes('ship') || q.includes('boat') || q.includes('ais') || q.includes('eta') || q.includes('aurora') || q.includes('polar star')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Tracking ${vessels.length} expedition support vessels. AIS telemetry streams live position, heading and sea-ice approach vectors.`,
        dataSnippet: {
          title: 'Polar Fleet Telemetry',
          items: vessels.map(
            v => `${v.name} (${v.type}): Lat ${v.coords.lat.toFixed(2)}, Lng ${v.coords.lng.toFixed(2)} | Speed: ${v.speedKnots} kts | Dest: ${v.destination} (ETA: ${new Date(v.eta).toLocaleDateString()})`
          ),
          badge: 'FLEET UNDERWAY',
          badgeColor: 'cyan'
        },
        actionRoute: '/dashboard',
        actionLabel: 'Inspect Vessel Map'
      };
    }

    // 6. Expedition Risk
    if (q.includes('risk') || q.includes('weather') || q.includes('blizzard') || q.includes('expedition')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Now',
        text: `Overall operational risk for ${activeExpedition?.name || 'Active Expedition'} is evaluated at ${activeExpedition?.riskAssessment.overallRisk || 'MODERATE'}.`,
        dataSnippet: {
          title: 'Risk Assessment Breakdown',
          items: [
            `Weather Hazard: ${activeExpedition?.riskAssessment.weatherRisk || 'Katabatic surges active'}`,
            `Sea-Ice Hazard: ${activeExpedition?.riskAssessment.seaIceRisk || 'Concentration 6/10'}`,
            `Logistics Bottleneck: ${activeExpedition?.riskAssessment.logisticsRisk || 'Swell delays monitored'}`
          ],
          badge: `RISK: ${activeExpedition?.riskAssessment.overallRisk || 'MODERATE'}`,
          badgeColor: 'amber'
        },
        actionRoute: '/planning',
        actionLabel: 'View Expedition Plan'
      };
    }

    // Default fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: 'Now',
      text: `I queried application telemetry for "${query}". You can query me about:
1. "Which cargo is delayed?"
2. "Show low inventory"
3. "Are there any active emergencies?"
4. "Where are deployed personnel?"
5. "What vessels are approaching station?"
6. "What is the current expedition risk?"`,
      dataSnippet: {
        title: 'Quick Metrics',
        items: [
          `Stations Monitored: ${stations.length}`,
          `Vessels Tracked: ${vessels.length}`,
          `Cargo Items: ${cargo.length} (${formatWeight(cargo.reduce((s, c) => s + c.weightKg, 0))})`,
          `Active Incidents: ${emergencies.filter(e => e.status !== 'RESOLVED').length}`
        ],
        badge: 'SYSTEM READY',
        badgeColor: 'cyan'
      }
    };
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Now',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate snappy realistic processing delay (250ms)
    setTimeout(() => {
      const response = generateDeterministicAnswer(q);
      setMessages(prev => [...prev, response]);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] h-[min(620px,75vh)] sm:h-[620px] max-h-[85vh] bg-polar-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden font-mono text-left select-none animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Subtle grid watermark */}
      <div className="absolute inset-0 polar-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative p-3.5 border-b border-slate-800 bg-polar-950/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>POLAR AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 font-mono">
                OPS-SUPPORT
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 truncate">
              Autonomous Polar Decision Assistant
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800 transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 border-b border-slate-800/80 bg-polar-950/40 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0">
        <button
          onClick={() => handleSend('Which cargo is currently delayed?')}
          className="px-2 py-1 rounded bg-polar-800/70 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          <Box className="w-3 h-3 text-cyan-400" />
          <span>Delayed Cargo</span>
        </button>

        <button
          onClick={() => handleSend('Which inventory items need urgent replenishment?')}
          className="px-2 py-1 rounded bg-polar-800/70 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          <Layers className="w-3 h-3 text-amber-400" />
          <span>Low Inventory</span>
        </button>

        <button
          onClick={() => handleSend('Are there any active emergencies?')}
          className="px-2 py-1 rounded bg-polar-800/70 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span>Emergencies</span>
        </button>

        <button
          onClick={() => handleSend('What vessels are approaching the research station?')}
          className="px-2 py-1 rounded bg-polar-800/70 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          <Ship className="w-3 h-3 text-cyan-400" />
          <span>Vessel AIS</span>
        </button>

        <button
          onClick={() => handleSend('Where are all deployed personnel?')}
          className="px-2 py-1 rounded bg-polar-800/70 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          <Users className="w-3 h-3 text-emerald-400" />
          <span>Personnel</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col max-w-[90%]',
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            )}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span>Commander</span>
                  <User className="w-3 h-3 text-cyan-400 ml-1" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-cyan-400 mr-1" />
                  <span>POLAR AI Core</span>
                </>
              )}
            </div>

            <div
              className={cn(
                'p-3 rounded-xl border leading-relaxed',
                msg.sender === 'user'
                  ? 'bg-cyan-950/80 text-cyan-100 border-cyan-500/40 rounded-br-xs'
                  : 'bg-polar-950/90 text-slate-200 border-slate-700/80 rounded-bl-xs shadow-md'
              )}
            >
              <p className="whitespace-pre-line font-sans text-xs">{msg.text}</p>

              {/* Data Snippet Card */}
              {msg.dataSnippet && (
                <div className="mt-2.5 p-2 rounded-lg bg-polar-900/90 border border-slate-800 text-[11px] font-mono">
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800">
                    <span className="font-bold text-slate-300">{msg.dataSnippet.title}</span>
                    {msg.dataSnippet.badge && (
                      <span
                        className={cn(
                          'text-[9px] px-1 py-0.2 rounded font-bold uppercase border',
                          msg.dataSnippet.badgeColor === 'red' && 'bg-rose-950 text-rose-300 border-rose-600/40',
                          msg.dataSnippet.badgeColor === 'amber' && 'bg-amber-950 text-amber-300 border-amber-600/40',
                          msg.dataSnippet.badgeColor === 'green' && 'bg-emerald-950 text-emerald-300 border-emerald-600/40',
                          (!msg.dataSnippet.badgeColor || msg.dataSnippet.badgeColor === 'cyan') && 'bg-cyan-950 text-cyan-300 border-cyan-600/40'
                        )}
                      >
                        {msg.dataSnippet.badge}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 text-slate-400">
                    {msg.dataSnippet.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-cyan-400 font-bold shrink-0">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation Action Button */}
              {msg.actionRoute && (
                <button
                  onClick={() => {
                    navigate(msg.actionRoute!);
                    onClose();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-[11px] transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  <span>{msg.actionLabel || 'Inspect Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-polar-950/90 flex items-center gap-2 relative z-10"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about delayed cargo, emergencies, inventory..."
          className="flex-1 bg-polar-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono tracking-wide"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer disabled:cursor-not-allowed shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
