import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Plus, Minus, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%23f8fafc%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22130%22%20r%3D%2236%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Cpath%20d%3D%22M190%20120h20v20h-20z%22%20fill%3D%22%2394a3b8%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%22190%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%2364748b%22%20font-weight%3D%22600%22%20font-size%3D%2213%22%20font-family%3D%22sans-serif%22%3ESyncCart%20Product%3C%2Ftext%3E%3C%2Fsvg%3E";

export const ProductCard = ({ product, onAddToCart, onSelectProduct, disabled = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currency } = useRoom();

  const handleAdd = async (e) => {
    if (e) e.stopPropagation();
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

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group cursor-pointer relative"
    >
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-blue-700 border border-slate-200/80 shadow-2xs">
          {product.category || 'Groceries'}
        </div>
        {product.unit && (
          <div className="absolute bottom-2.5 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs">
            {product.unit}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-amber-700 flex items-center gap-1 border border-slate-200/80 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating || 4.8}</span>
        </div>

        {/* Hover Quick View Pill */}
        <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-blue-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>Click to view details</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                {formatCurrency(product.price, currency)}
              </span>
              {product.unit && (
                <span className="text-[11px] text-slate-400 font-medium">
                  / {product.unit}
                </span>
              )}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((q) => Math.max(1, q - 1));
              }}
              disabled={quantity <= 1 || disabled}
              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 disabled:opacity-30 transition"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((q) => q + 1);
              }}
              disabled={disabled}
              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 transition"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add to Room Button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || loading}
          className={`w-full mt-3.5 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            added
              ? 'bg-emerald-600 text-white shadow-emerald-500/25'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-500/25'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
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
              <span>Add to Room Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
