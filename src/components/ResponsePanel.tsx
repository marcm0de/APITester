'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toCurl } from '@/lib/httpClient';
import JsonViewer from './JsonViewer';
import { Copy, Check, Clock, HardDrive, FileText } from 'lucide-react';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusColor(status: number): string {
  if (status < 300) return 'text-green-400 bg-green-400/10';
  if (status < 400) return 'text-yellow-400 bg-yellow-400/10';
  return 'text-red-400 bg-red-400/10';
}

export default function ResponsePanel() {
  const { response, isLoading, error, method, url, params, headers, bodyType, bodyContent, auth } = useStore();
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Sending request...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-medium text-sm">Error</p>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a URL and click Send to see the response</p>
        </div>
      </div>
    );
  }

  const isJson = (() => {
    try { JSON.parse(response.body); return true; } catch { return false; }
  })();

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)]">
        <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-sm ${statusColor(response.status)}`}>
          {response.status} {response.statusText}
        </span>
        <span className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Clock size={14} /> {response.duration}ms
        </span>
        <span className="flex items-center gap-1.5 text-gray-400 text-sm">
          <HardDrive size={14} /> {formatSize(response.size)}
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => copyToClipboard(response.body, 'body')}
            className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
          >
            {copied === 'body' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            Copy Body
          </button>
          <button
            onClick={() => copyToClipboard(toCurl({ method, url, params, headers, bodyType, bodyContent, auth }), 'curl')}
            className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
          >
            {copied === 'curl' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            Copy cURL
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('body')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'body' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'headers' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Headers ({Object.keys(response.headers).length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'body' ? (
          isJson ? (
            <JsonViewer data={response.body} />
          ) : (
            <pre className="font-mono text-xs whitespace-pre-wrap text-gray-300">{response.body}</pre>
          )
        ) : (
          <div className="space-y-1">
            {Object.entries(response.headers).map(([k, v]) => (
              <div key={k} className="flex font-mono text-xs">
                <span className="text-purple-400 min-w-[200px]">{k}</span>
                <span className="text-gray-300">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
