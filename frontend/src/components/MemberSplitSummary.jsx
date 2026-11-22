import React from 'react';
import { Crown, User, ShoppingBag, UserMinus } from 'lucide-react';
import { formatCurrency, formatPercent, getInitials } from '../utils/formatters';

export const MemberSplitSummary = ({ room, currentUserId, isHost, onRemoveMember }) => {
  if (!room) return null;

  const contributions = room.contributions || [];
  const members = room.members || [];
  const memberRoleMap = new Map(members.map((m) => [m.userId, m.roomRole]));

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Member Contributions
            <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-medium">
              {contributions.length} Active
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time individual spending breakdown & equal split analysis
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contributions.map((contrib) => {
          const isCurrentUser = contrib.userId === currentUserId;
          const role = memberRoleMap.get(contrib.userId) || (contrib.userId === room.hostId ? 'HOST' : 'MEMBER');
          const isUserHost = role === 'HOST';

          return (
            <div
              key={contrib.userId || contrib.username}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                isCurrentUser
                  ? 'bg-brand-950/40 border-brand-500/40'
                  : 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {contrib.avatarUrl ? (
                    <img
                      src={contrib.avatarUrl}
                      alt={contrib.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200">
                      {getInitials(contrib.fullName || contrib.username)}
                    </div>
                  )}

                  {isUserHost && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900" title="Room Host">
                      <Crown className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {contrib.fullName || contrib.username}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.2 rounded font-semibold border border-brand-500/30">
                        You
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isUserHost
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {role}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {contrib.itemsCount} {contrib.itemsCount === 1 ? 'item' : 'items'} added
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">
                      {formatPercent(contrib.percentageOfCart)} of cart
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(contrib.totalContribution)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Split share: {formatCurrency(room.perMemberEqualSplit)}
                  </div>
                </div>

                {/* Host can remove members (except self) */}
                {isHost && !isUserHost && onRemoveMember && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${contrib.fullName} from this shopping room?`)) {
                        onRemoveMember(contrib.userId);
                      }
                    }}
                    title="Remove member from room"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
