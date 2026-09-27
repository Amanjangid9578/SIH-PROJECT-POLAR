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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-polar-950 text-slate-100 antialiased font-sans">
      {/* Tactical Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Topbar onOpenAiAssistant={() => setIsAiOpen(true)} />

        {/* SIH Hackathon Demo Controls Bar */}
        <DemoControlBar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto relative bg-polar-950 polar-grid p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <PolarAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Floating Assistant Trigger (Bottom Right) */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-12 px-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open POLAR AI Mission Support Assistant"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="tracking-wider">POLAR AI</span>
        </button>
      )}
    </div>
  );
};
