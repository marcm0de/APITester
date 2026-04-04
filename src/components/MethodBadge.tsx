'use client';

import { HttpMethod } from '@/types';

const colors: Record<HttpMethod, string> = {
  GET: 'text-emerald-300 bg-emerald-500/15 ring-emerald-500/30',
  POST: 'text-amber-300 bg-amber-500/15 ring-amber-500/30',
  PUT: 'text-sky-300 bg-sky-500/15 ring-sky-500/30',
  PATCH: 'text-orange-300 bg-orange-500/15 ring-orange-500/30',
  DELETE: 'text-rose-300 bg-rose-500/15 ring-rose-500/30',
};

export default function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ring-1 ${colors[method]}`}>
      {method}
    </span>
  );
}
