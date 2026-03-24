'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Sidebar from './Sidebar';
import UrlBar from './UrlBar';
import RequestTabs from './RequestTabs';
import ResponsePanel from './ResponsePanel';
import { Sun, Moon, Zap, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function AppShell() {
  const { theme, toggleTheme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex items-center gap-2 text-purple-400">
          <Zap size={24} />
          <span className="text-xl font-bold">APITester</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-purple-500" />
            <h1 className="text-lg font-bold tracking-tight">
              API<span className="text-purple-500">Tester</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">Lightweight API Client</span>
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 shrink-0 overflow-hidden">
            <Sidebar />
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Request Builder */}
          <div className="border-b border-[var(--border)]">
            <div className="p-4">
              <UrlBar />
            </div>
            <RequestTabs />
          </div>

          {/* Response */}
          <div className="flex-1 overflow-hidden">
            <ResponsePanel />
          </div>
        </main>
      </div>
    </div>
  );
}
