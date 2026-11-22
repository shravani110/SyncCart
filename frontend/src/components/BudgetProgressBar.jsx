import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Edit3, ShieldAlert } from 'lucide-react';
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
    return 'from-blue-600 via-blue-500 to-sky-400';
  };

  const getBadgeStyle = () => {
    if (isExceeded) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (percentage > 85) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${getBadgeStyle()}`}>
            {isExceeded ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce-short" />
            ) : (
              <TrendingUp className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Shared Room Budget
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getBadgeStyle()}`}>
                {isExceeded ? 'BUDGET EXCEEDED' : `${formatPercent(percentage)} USED`}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live synchronized budget tracking in Indian Rupees (₹)
            </p>
          </div>
        </div>

        {/* Budget Editor (Host only) */}
        {isHost && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32 pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Limit"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
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
                className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200 transition font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Adjust Budget</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      {/* Exceeded Banner Warning */}
      {isExceeded && (
        <div className="mt-3.5 flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-bold text-rose-700">Over Budget Warning: </span>
            The total cart value exceeds the allocated room budget by{' '}
            <span className="font-bold underline text-rose-800">
              {formatCurrency(Math.abs(remaining))}
            </span>
            . Consider removing items or having the Host increase the budget limit.
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
        <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Cart Total
          </span>
          <span className={`text-base font-extrabold ${isExceeded ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(total)}
          </span>
        </div>

        <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Room Budget
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {formatCurrency(budget)}
          </span>
        </div>

        <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            {remaining >= 0 ? 'Remaining' : 'Over Limit'}
          </span>
          <span
            className={`text-base font-extrabold ${
              remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>

        <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Equal Split (per member)
          </span>
          <span className="text-base font-extrabold text-blue-600">
            {formatCurrency(room.perMemberEqualSplit || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
