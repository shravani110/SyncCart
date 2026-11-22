import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Users, Package, LogOut, Plus, LogIn, ChevronDown, Radio, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { formatCurrency, getInitials } from '../utils/formatters';

export const Navbar = ({ onOpenRoomModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { room, isConnected, isHost } = useRoom();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = room?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                  Sync<span className="text-brand-400">Cart</span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 block font-medium">
                  Collaborative E-Commerce
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  location.pathname === '/products'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Products
              </Link>

              {room && (
                <Link
                  to={`/room/${room.roomCode}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    location.pathname.startsWith('/room')
                      ? 'bg-slate-800 text-brand-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Room Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/orders"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    location.pathname === '/orders'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Active Room Pill & Actions */}
          <div className="flex items-center gap-3">
            {/* Active Room Pill */}
            {room ? (
              <Link
                to={`/room/${room.roomCode}`}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-brand-500/50 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    {isConnected ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    )}
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-300">
                    {room.roomCode}
                  </span>
                </div>
                <div className="h-3 w-px bg-slate-700"></div>
                <span className="text-xs font-semibold text-slate-300">
                  {formatCurrency(room.totalCartAmount)} / {formatCurrency(room.budgetLimit)}
                </span>
                {isHost && (
                  <span className="p-0.5 bg-amber-500/20 text-amber-400 rounded" title="Host">
                    <Crown className="w-3 h-3 fill-current" />
                  </span>
                )}
              </Link>
            ) : null}

            {/* Room Button */}
            {isAuthenticated && (
              <button
                onClick={onOpenRoomModal}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-400" />
                <span>{room ? 'Change Room' : 'Join / Create Room'}</span>
              </button>
            )}

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-[11px] font-bold text-white flex items-center justify-center">
                      {getInitials(user.fullName)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.fullName || user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-700/60">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                    </div>

                    <Link
                      to="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-2 transition"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>Browse Products</span>
                    </Link>

                    {room && (
                      <Link
                        to={`/room/${room.roomCode}`}
                        onClick={() => setDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-2 transition"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Active Room ({room.roomCode})</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-2 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                      <span>Order History</span>
                    </Link>

                    <div className="border-t border-slate-700/60 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/30 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
