import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Zap, Wallet, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-16 py-3 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border border-blue-100 p-5 sm:p-14 shadow-sm">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-3.5 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-[11px] sm:text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>Next-Generation Collaborative Shopping</span>
          </div>

          <h1 className="text-2xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Shop Together. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Sync Live. Split Fairly.
            </span>
          </h1>

          <p className="text-xs sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create a shared shopping room with friends or roommates. Add items, watch the shared cart update in real-time via WebSockets, and track your shared budget with zero hassle.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
            <button
              onClick={handleStartShopping}
              className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>{room ? `Open Room (${room.roomCode})` : 'Start a Shopping Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-slate-300 hover:border-blue-300 shadow-2xs flex items-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          {!isAuthenticated && (
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 max-w-lg mx-auto">
              <p className="text-[11px] sm:text-xs text-slate-500 mb-2 font-semibold">
                Want to test real-time sync with multiple browsers?
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                  Host: <strong className="text-blue-600">alice</strong> / password123
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                  Member: <strong className="text-blue-600">bob</strong> / password123
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid - 2 side-by-side and 1 down on mobile, 3 side-by-side on desktop */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
        <div className="col-span-1 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-2 sm:mb-4">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Live WebSocket Sync</h3>
          <p className="text-[10px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">
            Spring Boot STOMP WebSockets stream item additions, quantity changes, and removals instantly without refreshing.
          </p>
        </div>

        <div className="col-span-1 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-2 sm:mb-4">
            <Wallet className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Shared Budget Tracking</h3>
          <p className="text-[10px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">
            Dynamic budget progress bar with proactive alerts when additions exceed your group spending limit.
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs hover:border-blue-300 transition">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-2 sm:mb-4">
            <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Role-Based Access Control</h3>
          <p className="text-[10px] sm:text-sm text-slate-500 leading-snug sm:leading-relaxed">
            Hosts manage the budget and checkout, while members independently manage items and track individual splits.
          </p>
        </div>
      </section>

      {/* Interactive Flow Preview - Steps Arranged Horizontally */}
      <section className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-12 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-10">
          <h2 className="text-lg sm:text-3xl font-black text-slate-900">How SyncCart Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Collaborative grocery shopping, road trips, or party planning in 3 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-600 text-white font-black text-xs sm:text-xl flex items-center justify-center shadow-md shadow-blue-500/25 mb-2 sm:mb-4">
              1
            </div>
            <h4 className="text-xs sm:text-base font-bold text-slate-900 mb-0.5 sm:mb-1 leading-tight">Create or Join</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs leading-tight sm:leading-normal">
              Host sets a budget and shares code with members.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-black text-xs sm:text-xl flex items-center justify-center shadow-md shadow-indigo-500/25 mb-2 sm:mb-4">
              2
            </div>
            <h4 className="text-xs sm:text-base font-bold text-slate-900 mb-0.5 sm:mb-1 leading-tight">Add Items</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs leading-tight sm:leading-normal">
              Everyone adds catalog items syncing live in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky-600 text-white font-black text-xs sm:text-xl flex items-center justify-center shadow-md shadow-sky-500/25 mb-2 sm:mb-4">
              3
            </div>
            <h4 className="text-xs sm:text-base font-bold text-slate-900 mb-0.5 sm:mb-1 leading-tight">Split & Checkout</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs leading-tight sm:leading-normal">
              Review member split summaries and place order.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
