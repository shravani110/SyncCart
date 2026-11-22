import React, { useState } from 'react';
import { X, PlusCircle, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { CURRENCY_SYMBOLS } from '../utils/formatters';

export const CreateOrJoinRoomModal = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(10000);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currency, setCurrency } = useRoom();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header Tabs */}
        <div className="p-6 pb-0 border-b border-slate-100">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-black text-slate-900">Shopping Room</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
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
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
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
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
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
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Room Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Weekend Party Groceries, Apartment Gear"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Shared Budget Limit
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 mb-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-100 transition"
                    title="Select Currency"
                  >
                    <option value="INR">Rs.</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                    <option value="GBP">£</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white text-slate-900 text-sm focus:outline-none"
                    placeholder="Enter budget limit"
                    required
                  />
                </div>

                {/* Quick Budget Chips */}
                <div className="flex gap-2">
                  {[1000, 5000, 10000, 25000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setBudgetLimit(amt)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                        Number(budgetLimit) === amt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {CURRENCY_SYMBOLS[currency] || 'Rs. '}{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                As Host, you control the shared budget limit, can invite members with your 6-character room code, and finalize the checkout.
              </p>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition disabled:opacity-50"
              >
                {loading ? 'Creating Shopping Room...' : 'Create Room & Become Host'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  6-Character Room Code
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SYNC99"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  required
                />
              </div>

              {/* Quick Demo Pill */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Try Pre-seeded Demo Room</span>
                  <span className="text-[11px] text-blue-700 font-mono font-bold">Code: SYNC99</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoJoin}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                >
                  Use Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !roomCode.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition disabled:opacity-50"
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
