import React from 'react';
import { Clock3, Sparkles } from 'lucide-react';

const typeStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const formatTime = (ts) => {
  if (!ts) return 'Just now';
  try {
    if (Array.isArray(ts)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = ts;
      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
      return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    }
    let iso = String(ts).trim();
    if (iso.includes('T') && !iso.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(iso)) {
      iso = `${iso}Z`;
    }
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date(iso));
  } catch (e) {
    return 'Just now';
  }
};

export const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center flex-shrink-0">
          <Clock3 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Activity Feed
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-bold">
              LIVE
            </span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time room synchronization logs
          </p>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-xs">
            <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-slate-300" />
            <p className="font-semibold text-slate-600">No activity yet</p>
            <p className="mt-0.5 text-[11px]">Live cart edits and budget updates will appear here instantly.</p>
          </div>
        ) : (
          activities.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white transition flex flex-col gap-1 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-slate-800 leading-relaxed">
                  {entry.message}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 uppercase ${
                    typeStyles[entry.type] || typeStyles.info
                  }`}
                >
                  {entry.type || 'info'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {formatTime(entry.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
