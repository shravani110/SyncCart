import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Zap, DollarSign, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';

export const HomePage = ({ onOpenRoomModal }) => {
  const { isAuthenticated } = useAuth();
  const { room } = useRoom();
  const navigate = useNavigate();

  const handleStartShopping = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (room) {
      navigate(`/room/${room.roomCode}`);
    } else {
      onOpenRoomModal();
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/90 to-slate-950 border border-slate-700/80 p-8 sm:p-14 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Next-Generation Collaborative Shopping</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Shop Together. <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Sync Live. Split Fairly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create a shared shopping room with friends or roommates. Add items, watch the shared cart update in real-time via WebSockets, and track your shared budget with zero hassle.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartShopping}
              className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span>{room ? `Open Room (${room.roomCode})` : 'Start a Shopping Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 flex items-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          {!isAuthenticated && (
            <div className="pt-6 border-t border-slate-800/80 max-w-lg mx-auto">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                Want to test real-time sync with multiple browsers?
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                  Host: <strong className="text-brand-300">alice</strong> / password123
                </span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                  Member: <strong className="text-brand-300">bob</strong> / password123
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Live WebSocket Sync</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Spring Boot STOMP WebSockets stream item additions, quantity changes, and removals instantly to all room participants without refreshing.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Shared Budget Tracking</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Dynamic budget progress bar with multi-color thresholds and proactive warnings when items would exceed your group limit.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Role-Based Access Control</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Hosts manage the budget, clear carts, and finalize checkouts, while members independently manage their own items and track individual splits.
          </p>
        </div>
      </section>

      {/* Interactive Flow Preview */}
      <section className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How SyncCart Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            Collaborative grocery shopping, road trips, or party planning in 3 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-brand-600/30 mb-4">
              1
            </div>
            <h4 className="text-base font-bold text-white mb-1">Create or Join Room</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Host sets a budget and gets a unique 6-character room code (e.g. <code>SYNC99</code>) to share with members.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
              2
            </div>
            <h4 className="text-base font-bold text-white mb-1">Add Items Collaboratively</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Everyone adds items from the catalog. Each item is tagged with the member who added it and syncs live.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-4">
              3
            </div>
            <h4 className="text-base font-bold text-white mb-1">Split & Checkout</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Review member split summaries, check equal split targets, and the Host places the combined order.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
