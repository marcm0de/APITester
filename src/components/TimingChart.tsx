'use client';

import { useStore } from '@/store/useStore';
import { useMemo } from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

export default function TimingChart() {
  const { history } = useStore();

  const recent = useMemo(() => history.slice(0, 20).reverse(), [history]);

  if (recent.length === 0) return null;

  const durations = recent.map((h) => h.duration);
  const maxDuration = Math.max(...durations, 1);
  const minDuration = Math.min(...durations);
  const avgDuration = Math.round(durations.reduce((s, d) => s + d, 0) / durations.length);
  const p95 = durations.slice().sort((a, b) => a - b)[Math.floor(durations.length * 0.95)] ?? maxDuration;

  // Trend: compare last 3 avg vs previous 3
  const trend = useMemo(() => {
    if (recent.length < 4) return 0;
    const recentAvg = recent.slice(-3).reduce((s, h) => s + h.duration, 0) / 3;
    const prevAvg = recent.slice(-6, -3).reduce((s, h) => s + h.duration, 0) / Math.min(3, recent.slice(-6, -3).length || 1);
    return recentAvg - prevAvg;
  }, [recent]);

  // Success rate
  const successRate = Math.round(
    (recent.filter((h) => h.status < 400).length / recent.length) * 100
  );

  // SVG sparkline
  const svgWidth = 280;
  const svgHeight = 60;
  const padding = 4;
  const graphWidth = svgWidth - padding * 2;
  const graphHeight = svgHeight - padding * 2;

  const points = recent.map((h, i) => {
    const x = padding + (i / Math.max(recent.length - 1, 1)) * graphWidth;
    const y = padding + graphHeight - (h.duration / maxDuration) * graphHeight;
    return { x, y, h };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${svgHeight - padding} L ${points[0].x.toFixed(1)} ${svgHeight - padding} Z`;

  const barColor = (duration: number) => {
    if (duration < 200) return 'bg-green-500';
    if (duration < 500) return 'bg-yellow-500';
    if (duration < 1000) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const statusDot = (status: number) => {
    if (status < 300) return 'bg-green-400';
    if (status < 400) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const lineColor = avgDuration < 200 ? '#22c55e' : avgDuration < 500 ? '#eab308' : avgDuration < 1000 ? '#f97316' : '#ef4444';

  return (
    <div className="p-3 border-b border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <Clock size={12} />
          Response Times
        </div>
        <div className="flex items-center gap-1.5">
          {trend < -20 ? (
            <TrendingDown size={12} className="text-green-400" />
          ) : trend > 20 ? (
            <TrendingUp size={12} className="text-red-400" />
          ) : (
            <Minus size={12} className="text-gray-500" />
          )}
          <span className="text-[10px] text-gray-500">{recent.length} reqs</span>
        </div>
      </div>

      {/* Sparkline graph */}
      {recent.length >= 2 && (
        <div className="mb-2 rounded-lg bg-gray-900/50 overflow-hidden">
          <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="block">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((pct) => (
              <line
                key={pct}
                x1={padding}
                x2={svgWidth - padding}
                y1={padding + graphHeight * (1 - pct)}
                y2={padding + graphHeight * (1 - pct)}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}
            {/* Area fill */}
            <path d={areaPath} fill={lineColor} opacity="0.08" />
            {/* Line */}
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="2.5"
                fill={p.h.status < 400 ? lineColor : '#ef4444'}
                opacity="0.8"
              >
                <title>{p.h.method} {p.h.status} — {p.h.duration}ms</title>
              </circle>
            ))}
          </svg>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="text-center">
          <div className="text-[10px] text-gray-600">Avg</div>
          <div className="text-xs font-mono text-gray-300">{avgDuration}ms</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-600">Min</div>
          <div className="text-xs font-mono text-green-400">{minDuration}ms</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-600">P95</div>
          <div className="text-xs font-mono text-yellow-400">{p95}ms</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-600">Success</div>
          <div className={`text-xs font-mono ${successRate >= 90 ? 'text-green-400' : successRate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
            {successRate}%
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-[3px] h-12">
        {recent.map((h) => {
          const heightPct = Math.max((h.duration / maxDuration) * 100, 4);
          return (
            <div
              key={h.id}
              className="flex-1 flex flex-col items-center gap-0.5 group relative"
            >
              <div
                className={`w-full rounded-t-sm ${barColor(h.duration)} opacity-70 group-hover:opacity-100 transition-opacity cursor-default min-h-[2px]`}
                style={{ height: `${heightPct}%` }}
              />
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot(h.status)} shrink-0`} />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-[10px] whitespace-nowrap shadow-lg">
                  <div className="font-mono text-gray-200">{h.method} {h.status}</div>
                  <div className="text-gray-400">{h.duration}ms</div>
                  <div className="text-gray-500 truncate max-w-[150px]">{h.url}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-gray-600">
        <span>oldest</span>
        <span>{recent.length} requests</span>
        <span>latest</span>
      </div>
    </div>
  );
}
