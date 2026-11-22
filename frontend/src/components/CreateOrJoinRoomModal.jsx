import React, { useState } from 'react';
import { X, PlusCircle, LogIn, Sparkles, DollarSign, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateOrJoinRoomModal = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(500);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const room = await onCreateRoom(name.trim(), Number(budgetLimit));
      onClose();
      navigate(`/room/${room.roomCode}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const code = roomCode.trim().toUpperCase();
      const room = await onJoinRoom(code);
      onClose();
      navigate(`/room/${room.roomCode}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoJoin = () => {
    setRoomCode('SYNC99');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header Tabs */}
        <div className="p-6 pb-0 border-b border-slate-700/80">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-bold text-white">Shopping Room</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('create');
                setError(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                tab === 'create'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Room (Host)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('join');
                setError(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                tab === 'join'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Join with Code</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Room Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Weekend Party Groceries, Apartment Gear"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Shared Budget Limit ($)
                </label>
                <div className="relative mb-2">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="flex gap-2">
                  {[200, 500, 1000, 2500].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setBudgetLimit(amt)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        budgetLimit === amt
                          ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                As Host, you control the shared budget, can invite members with your 6-digit room code, and finalize the checkout.
              </p>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
              >
                {loading ? 'Creating Shopping Room...' : 'Create Room & Become Host'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  6-Character Room Code
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SYNC99"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* Quick Demo Pill */}
              <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Try Pre-seeded Demo Room</span>
                  <span className="text-[11px] text-slate-400">Code: SYNC99</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoJoin}
                  className="px-2.5 py-1 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 rounded-lg text-xs font-semibold border border-brand-500/30 transition"
                >
                  Use Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !roomCode.trim()}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
              >
                {loading ? 'Joining Room...' : 'Join Collaborative Room'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
