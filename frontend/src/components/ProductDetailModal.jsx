import React, { useState } from 'react';
import { X, ShoppingCart, Star, Check, Plus, Minus, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, disabled = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currency } = useRoom();

  if (!isOpen || !product) return null;

  const handleAdd = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onAddToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setQuantity(1);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 z-10 overflow-hidden transform transition-all duration-300 scale-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition z-20"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image & Badges */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-xs h-64 sm:h-72 w-full flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.unit && (
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 border border-slate-200 shadow-sm">
                Unit: {product.unit}
              </div>
            )}
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              {product.category || 'Groceries'}
            </div>
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 flex items-center gap-1 border border-slate-200 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Details & Action */}
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Verified Fresh Item</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>
              {product.unit && (
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Pack Size: <span className="font-bold text-slate-700">{product.unit}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                <span className="text-3xl font-black text-blue-600">
                  {formatCurrency(product.price, currency)}
                </span>
              </div>
              {product.unit && (
                <span className="text-xs text-slate-500 font-medium">
                  / {product.unit}
                </span>
              )}
            </div>

            {/* Full Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Details
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Real-time WebSocket cart sync across room members</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Fair equal split tracking & budget alert protection</span>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-2 flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || disabled}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 shadow-2xs disabled:opacity-40 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={disabled}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Room Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={disabled || loading}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-98'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Room Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} to Room Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
