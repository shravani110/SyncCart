import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const ProductCard = ({ product, onAddToCart, disabled = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all flex flex-col group">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-brand-300 border border-slate-700/60">
          {product.category}
        </div>
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1 border border-slate-700/60">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
            <span className="text-lg font-extrabold text-white">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || disabled}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              disabled={disabled}
              className="p-1 rounded text-slate-400 hover:text-white transition"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add to Room Button */}
        <button
          onClick={handleAdd}
          disabled={disabled || loading}
          className={`w-full mt-3.5 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white shadow-lg shadow-brand-600/25'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Shared Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Room Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
