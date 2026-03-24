'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  HttpMethod,
  KeyValuePair,
  BodyType,
  AuthConfig,
  Collection,
  HistoryItem,
  ResponseData,
  Environment,
  SavedRequest,
} from '@/types';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const emptyKV = (): KeyValuePair => ({ id: uid(), key: '', value: '', enabled: true });

interface AppState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Request builder
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: BodyType;
  bodyContent: string;
  auth: AuthConfig;
  activeTab: 'params' | 'headers' | 'body' | 'auth';

  setMethod: (m: HttpMethod) => void;
  setUrl: (u: string) => void;
  setParams: (p: KeyValuePair[]) => void;
  setHeaders: (h: KeyValuePair[]) => void;
  setBodyType: (t: BodyType) => void;
  setBodyContent: (c: string) => void;
  setAuth: (a: AuthConfig) => void;
  setActiveTab: (t: 'params' | 'headers' | 'body' | 'auth') => void;

  // Response
  response: ResponseData | null;
  isLoading: boolean;
  error: string | null;
  setResponse: (r: ResponseData | null) => void;
  setIsLoading: (l: boolean) => void;
  setError: (e: string | null) => void;

  // History
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  loadFromHistory: (item: HistoryItem) => void;

  // Collections
  collections: Collection[];
  addCollection: (name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  saveToCollection: (collectionId: string, name: string) => void;
  deleteFromCollection: (collectionId: string, requestId: string) => void;
  loadFromCollection: (req: SavedRequest) => void;
  importCollections: (cols: Collection[]) => void;

  // Environments
  environments: Environment[];
  addEnvironment: (name: string) => void;
  deleteEnvironment: (id: string) => void;
  setActiveEnvironment: (id: string | null) => void;
  updateEnvironment: (env: Environment) => void;
  getActiveEnvironment: () => Environment | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Request builder
      method: 'GET',
      url: '',
      params: [emptyKV()],
      headers: [emptyKV()],
      bodyType: 'json',
      bodyContent: '',
      auth: { type: 'none' },
      activeTab: 'params',

      setMethod: (method) => set({ method }),
      setUrl: (url) => set({ url }),
      setParams: (params) => set({ params }),
      setHeaders: (headers) => set({ headers }),
      setBodyType: (bodyType) => set({ bodyType }),
      setBodyContent: (bodyContent) => set({ bodyContent }),
      setAuth: (auth) => set({ auth }),
      setActiveTab: (activeTab) => set({ activeTab }),

      // Response
      response: null,
      isLoading: false,
      error: null,
      setResponse: (response) => set({ response }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // History
      history: [],
      addHistory: (item) =>
        set((s) => ({
          history: [item, ...s.history].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
      loadFromHistory: (item) =>
        set({
          method: item.method,
          url: item.url,
          params: item.request.params.length ? item.request.params : [emptyKV()],
          headers: item.request.headers.length ? item.request.headers : [emptyKV()],
          bodyType: item.request.bodyType,
          bodyContent: item.request.bodyContent,
          auth: item.request.auth,
        }),

      // Collections
      collections: [],
      addCollection: (name, description = '') =>
        set((s) => ({
          collections: [
            ...s.collections,
            {
              id: uid(),
              name,
              description,
              requests: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),
      deleteCollection: (id) =>
        set((s) => ({
          collections: s.collections.filter((c) => c.id !== id),
        })),
      renameCollection: (id, name) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === id ? { ...c, name, updatedAt: Date.now() } : c
          ),
        })),
      saveToCollection: (collectionId, name) => {
        const s = get();
        const req: SavedRequest = {
          id: uid(),
          name,
          method: s.method,
          url: s.url,
          params: s.params,
          headers: s.headers,
          bodyType: s.bodyType,
          bodyContent: s.bodyContent,
          auth: s.auth,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({
          collections: s.collections.map((c) =>
            c.id === collectionId
              ? { ...c, requests: [...c.requests, req], updatedAt: Date.now() }
              : c
          ),
        });
      },
      deleteFromCollection: (collectionId, requestId) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  requests: c.requests.filter((r) => r.id !== requestId),
                  updatedAt: Date.now(),
                }
              : c
          ),
        })),
      loadFromCollection: (req) =>
        set({
          method: req.method,
          url: req.url,
          params: req.params.length ? req.params : [emptyKV()],
          headers: req.headers.length ? req.headers : [emptyKV()],
          bodyType: req.bodyType,
          bodyContent: req.bodyContent,
          auth: req.auth,
        }),
      importCollections: (cols) =>
        set((s) => ({
          collections: [...s.collections, ...cols],
        })),

      // Environments
      environments: [],
      addEnvironment: (name) =>
        set((s) => ({
          environments: [
            ...s.environments,
            {
              id: uid(),
              name,
              variables: [{ id: uid(), key: '', value: '', enabled: true }],
              isActive: false,
            },
          ],
        })),
      deleteEnvironment: (id) =>
        set((s) => ({
          environments: s.environments.filter((e) => e.id !== id),
        })),
      setActiveEnvironment: (id) =>
        set((s) => ({
          environments: s.environments.map((e) => ({
            ...e,
            isActive: e.id === id,
          })),
        })),
      updateEnvironment: (env) =>
        set((s) => ({
          environments: s.environments.map((e) => (e.id === env.id ? env : e)),
        })),
      getActiveEnvironment: () => get().environments.find((e) => e.isActive),
    }),
    {
      name: 'api-tester-storage',
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
        collections: state.collections,
        environments: state.environments,
      }),
    }
  )
);
