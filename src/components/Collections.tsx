'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import MethodBadge from './MethodBadge';
import { FolderOpen, Plus, Trash2, ChevronRight, ChevronDown, Save, Download, Upload, X, Copy, Pencil, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Collection } from '@/types';

export default function Collections() {
  const {
    collections, addCollection, deleteCollection, renameCollection,
    saveToCollection, deleteFromCollection, loadFromCollection,
    importCollections, url,
  } = useStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCollection(newName.trim());
    setNewName('');
  };

  const handleSave = (collectionId: string) => {
    if (!saveName.trim()) return;
    saveToCollection(collectionId, saveName.trim());
    setSaving(null);
    setSaveName('');
  };

  const handleRename = (id: string) => {
    if (!renamingValue.trim()) return;
    renameCollection(id, renamingValue.trim());
    setRenaming(null);
    setRenamingValue('');
  };

  const startRename = (col: Collection) => {
    setRenaming(col.id);
    setRenamingValue(col.name);
  };

  const handleDuplicate = (col: Collection) => {
    const store = useStore.getState();
    const newCol: Collection = {
      ...col,
      id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
      name: `${col.name} (copy)`,
      requests: col.requests.map((r) => ({
        ...r,
        id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    store.importCollections([newCol]);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(collections, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'api-tester-collections.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportSingle = (col: Collection) => {
    const blob = new Blob([JSON.stringify(col, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${col.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        // Support both single collection and array of collections
        if (Array.isArray(data)) {
          importCollections(data as Collection[]);
        } else if (data.id && data.name && data.requests) {
          importCollections([data as Collection]);
        } else {
          alert('Invalid collection format');
        }
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const totalRequests = collections.reduce((s, c) => s + c.requests.length, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--border)] space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New collection..."
            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2.5 py-1.5 text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button onClick={handleCreate} className="text-purple-400 hover:text-purple-300 p-1.5 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} disabled={!collections.length} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-30">
            <Download size={12} /> Export All
          </button>
          <button onClick={() => fileRef.current?.click()} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            <Upload size={12} /> Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <span className="ml-auto text-[10px] text-gray-600">{collections.length} collections · {totalRequests} requests</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {collections.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <div className="text-center">
              <FolderOpen size={24} className="mx-auto mb-2 opacity-30" />
              No collections yet
            </div>
          </div>
        ) : (
          collections.map((col) => (
            <div key={col.id} className="border-b border-[var(--border)]">
              <div className="flex items-center px-3 py-2 hover:bg-[var(--bg-tertiary)] transition-colors">
                <button onClick={() => toggle(col.id)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                  {expanded[col.id] ? <ChevronDown size={14} className="text-gray-500 shrink-0" /> : <ChevronRight size={14} className="text-gray-500 shrink-0" />}
                  <FolderOpen size={14} className="text-purple-400 shrink-0" />
                  {renaming === col.id ? (
                    <input
                      type="text"
                      value={renamingValue}
                      onChange={(e) => setRenamingValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(col.id); if (e.key === 'Escape') setRenaming(null); }}
                      onBlur={() => handleRename(col.id)}
                      className="flex-1 bg-[var(--bg-tertiary)] border border-purple-500 rounded px-1.5 py-0.5 text-sm focus:outline-none"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium truncate">{col.name}</span>
                      <span className="text-xs text-gray-500">({col.requests.length})</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => startRename(col)} className="text-gray-600 hover:text-gray-300 transition-colors p-1" title="Rename">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDuplicate(col)} className="text-gray-600 hover:text-purple-400 transition-colors p-1" title="Duplicate">
                    <Copy size={12} />
                  </button>
                  <button onClick={() => handleExportSingle(col)} className="text-gray-600 hover:text-gray-300 transition-colors p-1" title="Export">
                    <Download size={12} />
                  </button>
                  <button
                    onClick={() => { setSaving(saving === col.id ? null : col.id); setSaveName(url ? `${url.split('/').pop() || 'request'}` : 'New Request'); }}
                    className="text-gray-500 hover:text-purple-400 transition-colors p-1"
                    title="Save current request"
                  >
                    <Save size={13} />
                  </button>
                  <button onClick={() => deleteCollection(col.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {saving === col.id && (
                <div className="px-3 pb-2 flex gap-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(col.id)}
                    placeholder="Request name..."
                    className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                  <button onClick={() => handleSave(col.id)} className="text-purple-400 hover:text-purple-300 text-xs transition-colors">
                    Save
                  </button>
                  <button onClick={() => setSaving(null)} className="text-gray-500 hover:text-gray-300 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}

              {expanded[col.id] && (
                <div className="pb-1">
                  {col.requests.length === 0 ? (
                    <p className="text-xs text-gray-600 px-8 py-2">Empty collection</p>
                  ) : (
                    col.requests.map((req) => (
                      <div key={req.id} className="flex items-center px-8 py-1.5 hover:bg-[var(--bg-tertiary)] transition-colors group">
                        <button
                          onClick={() => loadFromCollection(req)}
                          className="flex items-center gap-2 flex-1 text-left min-w-0"
                        >
                          <MethodBadge method={req.method} />
                          <span className="text-xs text-gray-300 truncate">{req.name}</span>
                          <span className="text-[10px] text-gray-600 truncate ml-auto opacity-0 group-hover:opacity-100">
                            {req.url?.split('//')[1]?.split('/').slice(0, 2).join('/') || ''}
                          </span>
                        </button>
                        <button
                          onClick={() => deleteFromCollection(col.id, req.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
