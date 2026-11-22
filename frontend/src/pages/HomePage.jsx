import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Zap, IndianRupee, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border border-blue-100 p-8 sm:p-14 shadow-sm">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Next-Generation Collaborative Shopping in Rupees (₹)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Shop Together. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Sync Live. Split Fairly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create a shared shopping room with friends or roommates. Add items, watch the shared cart update in real-time via WebSockets, and track your shared budget in ₹ with zero hassle.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartShopping}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>{room ? `Open Room (${room.roomCode})` : 'Start a Shopping Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-300 hover:border-blue-300 shadow-2xs flex items-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          {!isAuthenticated && (
            <div className="pt-6 border-t border-slate-200/80 max-w-lg mx-auto">
              <p className="text-xs text-slate-500 mb-2 font-semibold">
                Want to test real-time sync with multiple browsers?
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                  Host: <strong className="text-blue-600">alice</strong> / password123
                </span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                  Member: <strong className="text-blue-600">bob</strong> / password123
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Live WebSocket Sync</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Spring Boot STOMP WebSockets stream item additions, quantity changes, and removals instantly to all room participants without refreshing.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Shared Budget Tracking (₹)</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Dynamic budget progress bar in Indian Rupees with proactive alerts when additions exceed your group spending limit.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Access Control</h3>
          <p className="text-sm text-slate-400 leading-relaxed text-slate-500">
            Hosts manage the budget, clear carts, and finalize checkouts, while members independently manage their own items and track individual splits.
          </p>
        </div>
      </section>

      {/* Interactive Flow Preview */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How SyncCart Works</h2>
          <p className="text-sm text-slate-500 mt-2">
            Collaborative grocery shopping, road trips, or party planning in 3 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Create or Join Room</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Host sets a budget in ₹ and gets a unique 6-character room code (e.g. <code>SYNC99</code>) to share with members.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Add Items Collaboratively</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Everyone adds items from the catalog. Each item is tagged with the member who added it and syncs live.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-sky-500/25 mb-4">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Split & Checkout</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Review member split summaries in rupees, check equal split targets, and the Host places the combined order.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
