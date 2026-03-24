'use client';

import { useState } from 'react';
import History from './History';
import Collections from './Collections';
import Environments from './Environments';
import TimingChart from './TimingChart';
import { Clock, FolderOpen, Globe } from 'lucide-react';

type SidebarTab = 'history' | 'collections' | 'environments';

const tabs: { key: SidebarTab; label: string; icon: typeof Clock }[] = [
  { key: 'history', label: 'History', icon: Clock },
  { key: 'collections', label: 'Collections', icon: FolderOpen },
  { key: 'environments', label: 'Env', icon: Globe },
];

export default function Sidebar() {
  const [active, setActive] = useState<SidebarTab>('history');

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] border-r border-[var(--border)]">
      <div className="flex border-b border-[var(--border)]">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                active === t.key
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {active === 'history' && <TimingChart />}

      <div className="flex-1 overflow-hidden">
        {active === 'history' && <History />}
        {active === 'collections' && <Collections />}
        {active === 'environments' && <Environments />}
      </div>
    </div>
  );
}
