import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Box,
  Layers,
  Users,
  AlertTriangle,
  Cpu,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Radio,
  X
} from 'lucide-react';
import { cn } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { emergencies, cargo, inventory, personnel } = useApp();
  const location = useLocation();

  // Close drawer after navigation on phones
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close only on route change
  }, [location.pathname]);

  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'RESOLVED').length;
  const delayedCargoCount = cargo.filter(c => c.status === 'Delayed').length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.reorderThreshold).length;
  const overduePersonnelCount = personnel.filter(p => p.checkInOverdue).length;

  const navItems = [
    { to: '/dashboard', label: 'Mission Control', icon: Compass, shortcut: '1' },
    { to: '/planning', label: 'Expedition Planning', icon: Calendar, shortcut: '2' },
    {
      to: '/cargo',
      label: 'Cargo Tracking',
      icon: Box,
      badge: delayedCargoCount > 0 ? `${delayedCargoCount} DELAY` : undefined,
      badgeVariant: 'amber' as const,
      shortcut: '3'
    },
    {
      to: '/inventory',
      label: 'Inventory',
      icon: Layers,
      badge: lowStockCount > 0 ? `${lowStockCount} LOW` : undefined,
      badgeVariant: 'amber' as const,
      shortcut: '4'
    },
    {
      to: '/personnel',
      label: 'Personnel Movement',
      icon: Users,
      badge: overduePersonnelCount > 0 ? `${overduePersonnelCount} ALERT` : undefined,
      badgeVariant: 'red' as const,
      shortcut: '5'
    },
    {
      to: '/emergency',
      label: 'Emergency Response',
      icon: AlertTriangle,
      badge: activeEmergenciesCount > 0 ? `${activeEmergenciesCount} ACTIVE` : undefined,
      badgeVariant: 'red' as const,
      isEmergency: true,
      shortcut: '6'
    },
    { to: '/automation', label: 'Smart Automation', icon: Cpu, shortcut: '7' },
    { to: '/analytics', label: 'Analytics', icon: BarChart3, shortcut: '8' },
    { to: '/settings', label: 'Settings', icon: Settings, shortcut: '9' }
  ];

  // On mobile drawer always show labels (ignore desktop collapse)
  const showLabels = !collapsed || mobileOpen;

  return (
    <aside
      className={cn(
        'bg-polar-900 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between select-none h-screen',
        // Mobile: off-canvas drawer
        'fixed inset-y-0 left-0 z-50 w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: in-flow sidebar (unchanged behavior)
        'lg:static lg:z-30 lg:translate-x-0 lg:shrink-0 lg:sticky lg:top-0',
        collapsed ? 'lg:w-16' : 'lg:w-64'
      )}
    >
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-polar-950/60">
          {showLabels ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="text-sm font-black tracking-wider text-slate-100 font-mono flex items-center gap-1.5">
                  POLAR COMMAND
                </span>
                <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest truncate uppercase">
                  LOGISTICS & ASSET OPS
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto h-9 w-9 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Radio className="w-5 h-5 text-cyan-400" />
            </div>
          )}

          {mobileOpen && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-polar-800"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="p-2 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-11rem)]">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onMobileClose?.()}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all group relative',
                    isActive
                      ? item.isEmergency && activeEmergenciesCount > 0
                        ? 'bg-rose-950/70 text-rose-200 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                        : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-polar-800/60 border border-transparent'
                  )
                }
                title={!showLabels ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? item.isEmergency && activeEmergenciesCount > 0
                            ? 'text-rose-400'
                            : 'text-cyan-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {showLabels && (
                      <span className="truncate tracking-wide">{item.label}</span>
                    )}

                    {showLabels && item.badge && (
                      <span
                        className={cn(
                          'ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded tracking-tighter shrink-0 border uppercase font-bold',
                          item.badgeVariant === 'red'
                            ? 'bg-rose-950 text-rose-300 border-rose-600/50 animate-pulse'
                            : 'bg-amber-950 text-amber-300 border-amber-600/50'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!showLabels && item.badge && (
                      <span
                        className={cn(
                          'absolute top-2 right-2 h-2 w-2 rounded-full',
                          item.badgeVariant === 'red' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                        )}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/80 bg-polar-950/40 space-y-2">
        {showLabels && activeEmergenciesCount > 0 && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-lg p-2.5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            <div className="overflow-hidden">
              <p className="text-[11px] font-mono text-rose-300 font-bold uppercase truncate">
                INCIDENT RESPONSE
              </p>
              <p className="text-[10px] text-rose-400/80 font-mono truncate">
                {activeEmergenciesCount} active alert(s)
              </p>
            </div>
          </div>
        )}

        {/* Collapse only on desktop */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-polar-800 border border-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono">
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE CONSOLE</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
