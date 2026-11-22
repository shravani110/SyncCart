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
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-blue-700 border border-slate-200/80 shadow-2xs">
          {product.category}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-amber-700 flex items-center gap-1 border border-slate-200/80 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Price</span>
            <span className="text-lg font-black text-slate-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || disabled}
              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 disabled:opacity-30 transition"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              disabled={disabled}
              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 transition"
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
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-500/25'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Room Cart!</span>
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
