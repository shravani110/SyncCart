import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
    setLoading(true);
    try {
      await login(user, pass);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30 mb-3">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your shared shopping rooms
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice or alice@example.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick 1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alice', 'password123')}
              className="p-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                A
              </div>
              <div>
                <span className="font-bold text-white block text-[11px]">Alice</span>
                <span className="text-[10px] text-amber-400">Host (Demo)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('bob', 'password123')}
              className="p-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-[10px]">
                B
              </div>
              <div>
                <span className="font-bold text-white block text-[11px]">Bob</span>
                <span className="text-[10px] text-brand-300">Member</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('charlie', 'password123')}
              className="p-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                C
              </div>
              <div>
                <span className="font-bold text-white block text-[11px]">Charlie</span>
                <span className="text-[10px] text-slate-400">Member</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('diana', 'password123')}
              className="p-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[10px]">
                D
              </div>
              <div>
                <span className="font-bold text-white block text-[11px]">Diana</span>
                <span className="text-[10px] text-slate-400">Member</span>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};
