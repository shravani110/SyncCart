import React from 'react';
import { Plus, Minus, Trash2, User, Lock } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

export const CartItemRow = ({
  item,
  currentUserId,
  isHost,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const isOwner = item.addedByUserId === currentUserId;
  const canModify = isHost || isOwner;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900/80 border border-slate-700/60 rounded-xl gap-4 transition-all group">
      {/* Product Image & Details */}
      <div className="flex items-center gap-3.5">
        <img
          src={item.productImageUrl}
          alt={item.productName}
          className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700/80 flex-shrink-0"
        />
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-brand-400 uppercase">
            {item.productCategory}
          </span>
          <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1">
            {item.productName}
          </h4>
          <div className="text-xs text-slate-400 mt-1">
            Unit Price: <span className="text-slate-200 font-medium">{formatCurrency(item.unitPrice)}</span>
          </div>

          {/* Added by Badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {item.addedByAvatarUrl ? (
              <img
                src={item.addedByAvatarUrl}
                alt={item.addedByFullName}
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-700 text-[8px] flex items-center justify-center text-slate-200">
                {getInitials(item.addedByFullName)}
              </div>
            )}
            <span className="text-[11px] text-slate-400">
              Added by{' '}
              <span className={`font-medium ${isOwner ? 'text-brand-300' : 'text-slate-300'}`}>
                {isOwner ? 'You' : item.addedByFullName}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-5">
        {/* Quantity Controls */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
          <button
            disabled={!canModify || item.quantity <= 1}
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition"
            title={canModify ? 'Decrease quantity' : 'Only Host or item owner can change quantity'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-white">
            {item.quantity}
          </span>
          <button
            disabled={!canModify}
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition"
            title={canModify ? 'Increase quantity' : 'Only Host or item owner can change quantity'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-bold text-white block">
            {formatCurrency(item.subtotal)}
          </span>
          <span className="text-[10px] text-slate-400 block">Subtotal</span>
        </div>

        {/* Remove Button */}
        <div>
          {canModify ? (
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Remove from shared cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div
              className="p-2 text-slate-600 cursor-not-allowed"
              title="Only Host or the member who added this item can remove it"
            >
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
