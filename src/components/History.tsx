'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import MethodBadge from './MethodBadge';
import { Search, Trash2, Clock } from 'lucide-react';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function History() {
  const { history, loadFromHistory, clearHistory } = useStore();
  const [search, setSearch] = useState('');

  const filtered = history.filter(
    (h) =>
      h.url.toLowerCase().includes(search.toLowerCase()) ||
      h.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-[var(--bg-tertiary)] rounded px-2.5 py-1.5">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="bg-transparent text-sm flex-1 focus:outline-none placeholder:text-gray-600"
            />
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Clear history">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <div className="text-center">
              <Clock size={24} className="mx-auto mb-2 opacity-30" />
              {history.length === 0 ? 'No history yet' : 'No matches'}
            </div>
          </div>
        ) : (
          filtered.map((h) => (
            <button
              key={h.id}
              onClick={() => loadFromHistory(h)}
              className="w-full text-left px-3 py-2.5 border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <MethodBadge method={h.method} />
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  h.status < 300 ? 'bg-green-500/10 text-green-400' :
                  h.status < 400 ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {h.status}
                </span>
                <span className="text-xs text-gray-500">{h.duration}ms</span>
                <span className="text-xs text-gray-600 ml-auto">{timeAgo(h.timestamp)}</span>
              </div>
              <p className="text-xs text-gray-400 truncate font-mono">{h.url}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
