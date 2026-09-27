import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCheck,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo, cn } from '../../utils/formatters';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS'>('ALL');
  const navigate = useNavigate();

  if (!isNotificationOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filterSeverity === 'ALL') return true;
    return n.severity === filterSeverity;
  });

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const getSeverityBorder = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'border-rose-500/40 bg-rose-950/30';
      case 'WARNING':
        return 'border-amber-500/40 bg-amber-950/25';
      case 'SUCCESS':
        return 'border-emerald-500/40 bg-emerald-950/25';
      default:
        return 'border-sky-500/30 bg-sky-950/25';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-polar-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-polar-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10 text-left">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-polar-950/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                  Command Telemetry Feed
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  {notifications.filter(n => !n.read).length} UNREAD
                </span>
              </div>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto text-[11px]">
              {(['ALL', 'CRITICAL', 'WARNING', 'INFO', 'SUCCESS'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={cn(
                    'px-2 py-0.5 rounded uppercase tracking-wider font-semibold transition-all',
                    filterSeverity === sev
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-polar-800'
                  )}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Mark All Read Action */}
            <div className="flex items-center justify-between mt-2 pt-2 text-[11px] text-slate-400">
              <span>Showing {filteredNotifications.length} alerts</span>
              <button
                onClick={markAllNotificationsRead}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No notifications matching current filter.
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all text-xs relative group',
                    getSeverityBorder(notif.severity),
                    !notif.read ? 'ring-1 ring-cyan-500/40' : 'opacity-85'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {getSeverityIcon(notif.severity)}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 uppercase tracking-wide truncate">
                          {notif.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono text-cyan-400/90 font-bold">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                        {notif.targetRoute && (
                          <button
                            onClick={() => {
                              markNotificationRead(notif.id);
                              setIsNotificationOpen(false);
                              navigate(notif.targetRoute!);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline font-bold uppercase cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-polar-800"
                        title="Mark read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-polar-800"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-polar-950/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Automated event bus online</span>
            <span className="text-emerald-400 font-bold">● ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
