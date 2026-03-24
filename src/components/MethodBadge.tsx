'use client';

import { HttpMethod } from '@/types';

const colors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-yellow-400',
  PUT: 'text-blue-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
};

export default function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span className={`font-mono font-bold text-xs ${colors[method]}`}>
      {method}
    </span>
  );
}
