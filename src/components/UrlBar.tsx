'use client';

import { useStore } from '@/store/useStore';
import { HttpMethod } from '@/types';
import { sendRequest } from '@/lib/httpClient';
import { Send, Loader2 } from 'lucide-react';

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-yellow-400',
  PUT: 'text-blue-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
};

export default function UrlBar() {
  const {
    method, url, params, headers, bodyType, bodyContent, auth,
    setMethod, setUrl, setResponse, setIsLoading, setError,
    isLoading, addHistory, getActiveEnvironment,
  } = useStore();

  const handleSend = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const env = getActiveEnvironment();
      const res = await sendRequest({ method, url, params, headers, bodyType, bodyContent, auth, env });
      setResponse(res);
      addHistory({
        id: Math.random().toString(36).slice(2),
        method,
        url,
        status: res.status,
        statusText: res.statusText,
        duration: res.duration,
        size: res.size,
        timestamp: Date.now(),
        request: { params, headers, bodyType, bodyContent, auth },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 font-mono font-bold text-sm focus:outline-none focus:border-purple-500 ${methodColors[method]}`}
      >
        {methods.map((m) => (
          <option key={m} value={m} className="text-white">
            {m}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Enter URL or paste cURL..."
        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2.5 font-mono text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
      />

      <button
        onClick={handleSend}
        disabled={isLoading || !url.trim()}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        Send
      </button>
    </div>
  );
}
