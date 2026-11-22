import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogIn, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="flex-1 flex items-center justify-center py-2 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center shadow-md shadow-blue-500/25 mb-2">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign in to access your shared shopping rooms
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice or alice@example.com"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
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
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick 1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alice', 'password123')}
              className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition text-xs flex items-center gap-2 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                A
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Alice</span>
                <span className="text-[10px] text-amber-700 font-medium">Host (Demo)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('bob', 'password123')}
              className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition text-xs flex items-center gap-2 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                B
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Bob</span>
                <span className="text-[10px] text-blue-700 font-medium">Member</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('charlie', 'password123')}
              className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition text-xs flex items-center gap-2 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                C
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Charlie</span>
                <span className="text-[10px] text-slate-500 font-medium">Member</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('diana', 'password123')}
              className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition text-xs flex items-center gap-2 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                D
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Diana</span>
                <span className="text-[10px] text-slate-500 font-medium">Member</span>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};
