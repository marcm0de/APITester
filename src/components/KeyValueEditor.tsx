'use client';

import { KeyValuePair } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

interface Props {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export default function KeyValueEditor({ pairs, onChange, keyPlaceholder = 'Key', valuePlaceholder = 'Value' }: Props) {
  const update = (id: string, field: keyof KeyValuePair, value: string | boolean) => {
    onChange(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const remove = (id: string) => {
    const next = pairs.filter((p) => p.id !== id);
    onChange(next.length ? next : [{ id: uid(), key: '', value: '', enabled: true }]);
  };

  const add = () => {
    onChange([...pairs, { id: uid(), key: '', value: '', enabled: true }]);
  };

  return (
    <div className="space-y-2">
      {pairs.map((p) => (
        <div key={p.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={p.enabled}
            onChange={(e) => update(p.id, 'enabled', e.target.checked)}
            className="accent-purple-500 w-4 h-4"
          />
          <input
            type="text"
            value={p.key}
            onChange={(e) => update(p.id, 'key', e.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            value={p.value}
            onChange={(e) => update(p.id, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => remove(p.id)}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  );
}
