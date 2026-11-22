import React, { useState } from 'react';
import { Crown, ShoppingBag, UserMinus } from 'lucide-react';
import { formatCurrency, formatPercent, getInitials } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

export const MemberSplitSummary = ({ room, currentUserId, isHost, onRemoveMember }) => {
  const { currency } = useRoom();
  const [memberToRemove, setMemberToRemove] = useState(null);
  if (!room) return null;

  const contributions = room.contributions || [];
  const members = room.members || [];
  const memberRoleMap = new Map(members.map((m) => [m.userId, m.roomRole]));

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Member Contributions
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.2 rounded-full font-semibold">
              {contributions.length} Active
            </span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time individual spending breakdown & equal split analysis
          </p>
        </div>
      </div>

      {contributions.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
          No member items yet. Individual split shares will compute automatically as items are added.
        </div>
      ) : (
        <div className="space-y-2.5">
        {contributions.map((contrib) => {
          const isCurrentUser = contrib.userId === currentUserId;
          const role = memberRoleMap.get(contrib.userId) || (contrib.userId === room.hostId ? 'HOST' : 'MEMBER');
          const isUserHost = role === 'HOST';

          return (
            <div
              key={contrib.userId || contrib.username}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                isCurrentUser
                  ? 'bg-blue-50/70 border-blue-300'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {contrib.avatarUrl ? (
                    <img
                      src={contrib.avatarUrl}
                      alt={contrib.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                      {getInitials(contrib.fullName || contrib.username)}
                    </div>
                  )}

                  {isUserHost && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 p-0.5 rounded-full ring-2 ring-white shadow-xs" title="Room Host">
                      <Crown className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {contrib.fullName || contrib.username}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                        You
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isUserHost
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      {contrib.itemsCount} {contrib.itemsCount === 1 ? 'item' : 'items'} added
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-700 font-semibold whitespace-nowrap">
                      {formatPercent(contrib.percentageOfCart)} of cart
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <div className="text-right whitespace-nowrap">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                    {formatCurrency(contrib.totalContribution, currency)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                    Split share: <span className="font-semibold text-slate-700">{formatCurrency(room.perMemberEqualSplit, currency)}</span>
                  </div>
                </div>

                {/* Host can remove members (except self) */}
                {isHost && !isUserHost && onRemoveMember && (
                  memberToRemove === contrib.userId ? (
                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg animate-fade-in">
                      <span className="text-[10px] font-bold text-rose-800">Remove?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveMember(contrib.userId);
                          setMemberToRemove(null);
                        }}
                        className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setMemberToRemove(null)}
                        className="px-1.5 py-0.5 bg-white text-slate-700 border border-slate-200 rounded text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMemberToRemove(contrib.userId)}
                      title="Remove member from room"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
