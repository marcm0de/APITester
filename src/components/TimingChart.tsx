'use client';

import { useStore } from '@/store/useStore';
import { Clock } from 'lucide-react';

export default function TimingChart() {
  const { history } = useStore();

  const recent = history.slice(0, 15).reverse();

  if (recent.length === 0) {
    return null;
  }

  const maxDuration = Math.max(...recent.map((h) => h.duration), 1);

  const barColor = (duration: number) => {
    if (duration < 200) return 'bg-green-500';
    if (duration < 500) return 'bg-yellow-500';
    if (duration < 1000) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const statusDot = (status: number) => {
    if (status < 300) return 'bg-green-400';
    if (status < 400) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const avgDuration = Math.round(
    recent.reduce((sum, h) => sum + h.duration, 0) / recent.length
  );

  const minDuration = Math.min(...recent.map((h) => h.duration));
  const maxDur = Math.max(...recent.map((h) => h.duration));

  return (
    <div className="p-3 border-b border-[var(--border)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <Clock size={12} />
          Request Timing
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>avg <span className="text-gray-300 font-mono">{avgDuration}ms</span></span>
          <span>min <span className="text-gray-300 font-mono">{minDuration}ms</span></span>
          <span>max <span className="text-gray-300 font-mono">{maxDur}ms</span></span>
        </div>
      </div>
      <div className="flex items-end gap-[3px] h-16">
        {recent.map((h, i) => {
          const heightPct = Math.max((h.duration / maxDuration) * 100, 4);
          return (
            <div
              key={h.id}
              className="flex-1 flex flex-col items-center gap-0.5 group relative"
            >
              <div
                className={`w-full rounded-t-sm ${barColor(h.duration)} opacity-80 group-hover:opacity-100 transition-opacity cursor-default min-h-[2px]`}
                style={{ height: `${heightPct}%` }}
              />
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot(h.status)} shrink-0`} />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-[10px] whitespace-nowrap shadow-lg">
                  <div className="font-mono text-gray-200">{h.method} {h.status}</div>
                  <div className="text-gray-400">{h.duration}ms</div>
                  <div className="text-gray-500 truncate max-w-[150px]">{h.url}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-gray-600">
        <span>oldest</span>
        <span>{recent.length} requests</span>
        <span>latest</span>
      </div>
    </div>
  );
}
