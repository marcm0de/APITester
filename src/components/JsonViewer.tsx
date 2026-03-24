'use client';

import { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

function JsonNode({ name, value, depth = 0 }: { name?: string; value: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value as Record<string, unknown>) : [];

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  if (!isObject) {
    let colorClass = 'text-green-400';
    let display = JSON.stringify(value);
    if (typeof value === 'number') colorClass = 'text-orange-400';
    else if (typeof value === 'boolean') colorClass = 'text-purple-400';
    else if (value === null) { colorClass = 'text-gray-500'; display = 'null'; }

    return (
      <div className="flex" style={{ paddingLeft: depth * 16 }}>
        {name !== undefined && (
          <span className="text-blue-300">&quot;{name}&quot;</span>
        )}
        {name !== undefined && <span className="text-gray-500 mx-1">:</span>}
        <span className={colorClass}>{display}</span>
      </div>
    );
  }

  const bracket = isArray ? ['[', ']'] : ['{', '}'];

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div className="flex items-center cursor-pointer hover:bg-white/5 rounded" onClick={toggle}>
        {collapsed ? <ChevronRight size={14} className="text-gray-500 shrink-0" /> : <ChevronDown size={14} className="text-gray-500 shrink-0" />}
        {name !== undefined && (
          <span className="text-blue-300 ml-1">&quot;{name}&quot;</span>
        )}
        {name !== undefined && <span className="text-gray-500 mx-1">:</span>}
        <span className="text-gray-400">{bracket[0]}</span>
        {collapsed && (
          <span className="text-gray-500 mx-1">
            {entries.length} {entries.length === 1 ? 'item' : 'items'}
          </span>
        )}
        {collapsed && <span className="text-gray-400">{bracket[1]}</span>}
      </div>
      {!collapsed && (
        <>
          {entries.map(([k, v], i) => (
            <div key={k + i}>
              <JsonNode name={isArray ? undefined : k} value={v} depth={depth + 1} />
              {i < entries.length - 1 && (
                <span className="text-gray-600" style={{ paddingLeft: (depth + 1) * 16 }}>,</span>
              )}
            </div>
          ))}
          <div style={{ paddingLeft: depth * 16 }}>
            <span className="text-gray-400">{bracket[1]}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function JsonViewer({ data }: { data: string }) {
  try {
    const parsed = JSON.parse(data);
    return (
      <div className="font-mono text-xs leading-relaxed overflow-auto">
        <JsonNode value={parsed} />
      </div>
    );
  } catch {
    return <pre className="font-mono text-xs whitespace-pre-wrap">{data}</pre>;
  }
}
