'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { EnvVariable } from '@/types';
import { Plus, Trash2, ChevronRight, ChevronDown, Globe, Check } from 'lucide-react';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export default function Environments() {
  const {
    environments, addEnvironment, deleteEnvironment,
    setActiveEnvironment, updateEnvironment,
  } = useStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newName, setNewName] = useState('');

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const handleCreate = () => {
    if (!newName.trim()) return;
    addEnvironment(newName.trim());
    setNewName('');
  };

  const updateVar = (envId: string, varId: string, field: keyof EnvVariable, value: string | boolean) => {
    const env = environments.find((e) => e.id === envId);
    if (!env) return;
    updateEnvironment({
      ...env,
      variables: env.variables.map((v) => (v.id === varId ? { ...v, [field]: value } : v)),
    });
  };

  const addVar = (envId: string) => {
    const env = environments.find((e) => e.id === envId);
    if (!env) return;
    updateEnvironment({
      ...env,
      variables: [...env.variables, { id: uid(), key: '', value: '', enabled: true }],
    });
  };

  const removeVar = (envId: string, varId: string) => {
    const env = environments.find((e) => e.id === envId);
    if (!env) return;
    const next = env.variables.filter((v) => v.id !== varId);
    updateEnvironment({
      ...env,
      variables: next.length ? next : [{ id: uid(), key: '', value: '', enabled: true }],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New environment..."
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2.5 py-1.5 text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button onClick={handleCreate} className="text-purple-400 hover:text-purple-300 p-1.5 transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {environments.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <div className="text-center">
              <Globe size={24} className="mx-auto mb-2 opacity-30" />
              No environments yet
            </div>
          </div>
        ) : (
          environments.map((env) => (
            <div key={env.id} className="border-b border-[var(--border)]">
              <div className="flex items-center px-3 py-2 hover:bg-[var(--bg-tertiary)] transition-colors">
                <button onClick={() => toggle(env.id)} className="flex items-center gap-2 flex-1 text-left">
                  {expanded[env.id] ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                  <Globe size={14} className={env.isActive ? 'text-green-400' : 'text-gray-500'} />
                  <span className="text-sm font-medium">{env.name}</span>
                  {env.isActive && <Check size={14} className="text-green-400" />}
                </button>
                <button
                  onClick={() => setActiveEnvironment(env.isActive ? null : env.id)}
                  className={`text-xs px-2 py-0.5 rounded transition-colors ${
                    env.isActive ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-purple-400'
                  }`}
                >
                  {env.isActive ? 'Active' : 'Activate'}
                </button>
                <button onClick={() => deleteEnvironment(env.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1 ml-1">
                  <Trash2 size={13} />
                </button>
              </div>

              {expanded[env.id] && (
                <div className="px-3 pb-3 space-y-2">
                  {env.variables.map((v) => (
                    <div key={v.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={v.enabled}
                        onChange={(e) => updateVar(env.id, v.id, 'enabled', e.target.checked)}
                        className="accent-purple-500 w-3.5 h-3.5"
                      />
                      <input
                        type="text"
                        value={v.key}
                        onChange={(e) => updateVar(env.id, v.id, 'key', e.target.value)}
                        placeholder="Variable name"
                        className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={v.value}
                        onChange={(e) => updateVar(env.id, v.id, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                      />
                      <button onClick={() => removeVar(env.id, v.id)} className="text-gray-600 hover:text-red-400 transition-colors p-0.5">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addVar(env.id)}
                    className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus size={12} /> Add Variable
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
