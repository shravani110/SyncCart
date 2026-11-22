import React, { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle2, TrendingUp, Edit3, ShieldAlert } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const BudgetProgressBar = ({ room, isHost, onUpdateBudget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(room?.budgetLimit || 500);

  if (!room) return null;

  const total = Number(room.totalCartAmount) || 0;
  const budget = Number(room.budgetLimit) || 1;
  const remaining = Number(room.remainingBudget) || 0;
  const percentage = Number(room.budgetUsagePercentage) || 0;
  const isExceeded = room.isBudgetExceeded;

  const getStatusColor = () => {
    if (isExceeded) return 'from-rose-600 to-red-500';
    if (percentage > 85) return 'from-amber-500 to-orange-500';
    return 'from-brand-500 to-emerald-400';
  };

  const getBadgeStyle = () => {
    if (isExceeded) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (percentage > 85) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (newBudget <= 0) return;
    try {
      await onUpdateBudget(newBudget);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${getBadgeStyle()}`}>
            {isExceeded ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce-short" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Shared Room Budget
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getBadgeStyle()}`}>
                {isExceeded ? 'BUDGET EXCEEDED' : `${formatPercent(percentage)} USED`}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live synchronized budget tracking for all members
            </p>
          </div>
        </div>

        {/* Budget Editor (Host only) */}
        {isHost && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-28 pl-7 pr-3 py-1.5 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Limit"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setNewBudget(budget);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-brand-300 bg-slate-700/60 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600/60 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Adjust Budget</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      {/* Exceeded Banner Warning */}
      {isExceeded && (
        <div className="mt-3.5 flex items-center gap-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-bold">Over Budget Warning: </span>
            The total cart value exceeds the allocated room budget by{' '}
            <span className="font-semibold underline text-white">
              {formatCurrency(Math.abs(remaining))}
            </span>
            . Consider removing items or having the Host increase the budget limit.
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-700/60">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
            Cart Total
          </span>
          <span className={`text-base font-bold ${isExceeded ? 'text-rose-400' : 'text-white'}`}>
            {formatCurrency(total)}
          </span>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
            Room Budget
          </span>
          <span className="text-base font-bold text-white">
            {formatCurrency(budget)}
          </span>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
            {remaining >= 0 ? 'Remaining' : 'Over Limit'}
          </span>
          <span
            className={`text-base font-bold ${
              remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
            Equal Split (per member)
          </span>
          <span className="text-base font-bold text-brand-300">
            {formatCurrency(room.perMemberEqualSplit || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
