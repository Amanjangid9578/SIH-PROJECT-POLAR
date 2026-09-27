import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoControlBar } from './DemoControlBar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationDrawer } from './NotificationDrawer';
import { PolarAssistant } from '../ai/PolarAssistant';
import { Sparkles } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-polar-950 text-slate-100 antialiased font-sans">
      {/* Mobile nav backdrop */}
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-polar-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar
          onOpenAiAssistant={() => setIsAiOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <DemoControlBar />

        <main className="flex-1 overflow-y-auto relative bg-polar-950 polar-grid p-3 sm:p-4 md:p-6 pb-24 sm:pb-6">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationDrawer />
      <PolarAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {!isAiOpen && (
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 h-12 w-12 sm:w-auto sm:px-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open POLAR AI Mission Support Assistant"
        >
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          <span className="tracking-wider hidden sm:inline">POLAR AI</span>
        </button>
      )}
    </div>
  );
};
