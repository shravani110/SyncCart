import React, { useState } from 'react';
import { Crown, Copy, Check, Users, Radio } from 'lucide-react';
import { getInitials } from '../utils/formatters';

export const ActiveMembersBadge = ({ room, isConnected }) => {
  const [copied, setCopied] = useState(false);

  if (!room) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const members = room.members || [];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      {/* Room Title & Code */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">{room.name}</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700">
              <span className="text-slate-400">Code:</span>
              <span className="text-brand-300 tracking-wider font-mono font-bold">
                {room.roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="ml-1 text-slate-400 hover:text-white transition"
                title="Copy Room Code to share with friends"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hosted by <span className="text-slate-200 font-medium">{room.hostFullName}</span>
          </p>
        </div>
      </div>

      {/* Member Avatars & Live Status */}
      <div className="flex items-center gap-4">
        {/* Real-time Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </span>
          <span className="text-slate-300 font-medium">
            {isConnected ? 'Real-Time Sync Active' : 'Connecting WebSocket...'}
          </span>
        </div>

        {/* Avatar Stack */}
        <div className="flex items-center -space-x-2">
          {members.map((m) => (
            <div
              key={m.userId}
              className="relative group cursor-pointer"
              title={`${m.fullName} (${m.roomRole})`}
            >
              {m.avatarUrl ? (
                <img
                  src={m.avatarUrl}
                  alt={m.fullName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 text-xs flex items-center justify-center font-bold text-white ring-2 ring-slate-800">
                  {getInitials(m.fullName)}
                </div>
              )}
              {m.roomRole === 'HOST' && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900">
                  <Crown className="w-2.5 h-2.5 fill-current" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
