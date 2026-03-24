'use client';

import { useStore } from '@/store/useStore';
import KeyValueEditor from './KeyValueEditor';

type Tab = 'params' | 'headers' | 'body' | 'auth';
const tabs: { key: Tab; label: string }[] = [
  { key: 'params', label: 'Params' },
  { key: 'headers', label: 'Headers' },
  { key: 'body', label: 'Body' },
  { key: 'auth', label: 'Auth' },
];

export default function RequestTabs() {
  const {
    activeTab, setActiveTab,
    params, setParams,
    headers, setHeaders,
    bodyType, setBodyType, bodyContent, setBodyContent,
    auth, setAuth, method,
  } = useStore();

  return (
    <div>
      <div className="flex border-b border-[var(--border)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === t.key
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
            {t.key === 'params' && params.filter((p) => p.key).length > 0 && (
              <span className="ml-1.5 text-xs bg-purple-500/20 text-purple-400 px-1.5 rounded-full">
                {params.filter((p) => p.key).length}
              </span>
            )}
            {t.key === 'headers' && headers.filter((h) => h.key).length > 0 && (
              <span className="ml-1.5 text-xs bg-purple-500/20 text-purple-400 px-1.5 rounded-full">
                {headers.filter((h) => h.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'params' && (
          <KeyValueEditor pairs={params} onChange={setParams} keyPlaceholder="Parameter" valuePlaceholder="Value" />
        )}

        {activeTab === 'headers' && (
          <KeyValueEditor pairs={headers} onChange={setHeaders} keyPlaceholder="Header" valuePlaceholder="Value" />
        )}

        {activeTab === 'body' && (
          <div className="space-y-3">
            {method === 'GET' ? (
              <p className="text-gray-500 text-sm">Body is not available for GET requests</p>
            ) : (
              <>
                <div className="flex gap-4">
                  {(['json', 'form-data', 'raw'] as const).map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="bodyType"
                        checked={bodyType === t}
                        onChange={() => setBodyType(t)}
                        className="accent-purple-500"
                      />
                      <span className={bodyType === t ? 'text-purple-400' : 'text-gray-400'}>
                        {t === 'json' ? 'JSON' : t === 'form-data' ? 'Form Data' : 'Raw'}
                      </span>
                    </label>
                  ))}
                </div>
                <textarea
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  placeholder={
                    bodyType === 'json'
                      ? '{\n  "key": "value"\n}'
                      : bodyType === 'form-data'
                      ? '{\n  "field": "value"\n}'
                      : 'Raw body content...'
                  }
                  className="w-full h-40 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <select
              value={auth.type}
              onChange={(e) => setAuth({ ...auth, type: e.target.value as 'none' | 'bearer' | 'basic' })}
              className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="none">No Auth</option>
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
            </select>

            {auth.type === 'bearer' && (
              <input
                type="text"
                value={auth.bearer || ''}
                onChange={(e) => setAuth({ ...auth, bearer: e.target.value })}
                placeholder="Token"
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
              />
            )}

            {auth.type === 'basic' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={auth.basicUser || ''}
                  onChange={(e) => setAuth({ ...auth, basicUser: e.target.value })}
                  placeholder="Username"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="password"
                  value={auth.basicPass || ''}
                  onChange={(e) => setAuth({ ...auth, basicPass: e.target.value })}
                  placeholder="Password"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
