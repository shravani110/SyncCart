import React from 'react';
import { Plus, Minus, Trash2, Lock } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

export const CartItemRow = ({
  item,
  currentUserId,
  isHost,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const { currency } = useRoom();
  const isOwner = item.addedByUserId === currentUserId;
  const canModify = isHost || isOwner;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-blue-50/30 border border-slate-200/90 rounded-2xl gap-4 shadow-2xs transition-all group">
      {/* Product Image & Details */}
      <div className="flex items-center gap-3.5">
        <img
          src={item.productImageUrl}
          alt={item.productName}
          className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-200 flex-shrink-0 shadow-2xs"
        />
        <div>
          <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
            {item.productCategory}
          </span>
          <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
            {item.productName}
          </h4>
          <div className="text-xs text-slate-500 mt-1">
            Unit Price: <span className="text-slate-800 font-semibold">{formatCurrency(item.unitPrice, currency)}</span>
          </div>

          {/* Added by Badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {item.addedByAvatarUrl ? (
              <img
                src={item.addedByAvatarUrl}
                alt={item.addedByFullName}
                className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-blue-600 text-[8px] flex items-center justify-center text-white font-bold">
                {getInitials(item.addedByFullName)}
              </div>
            )}
            <span className="text-[11px] text-slate-500">
              Added by{' '}
              <span className={`font-semibold ${isOwner ? 'text-blue-700' : 'text-slate-700'}`}>
                {isOwner ? 'You' : item.addedByFullName}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-5">
        {/* Quantity Controls */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-2xs">
          <button
            disabled={!canModify || item.quantity <= 1}
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
            title={canModify ? 'Decrease quantity' : 'Only Host or item owner can change quantity'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900">
            {item.quantity}
          </span>
          <button
            disabled={!canModify}
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
            title={canModify ? 'Increase quantity' : 'Only Host or item owner can change quantity'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <span className="text-sm font-extrabold text-slate-900 block">
            {formatCurrency(item.subtotal, currency)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">Subtotal</span>
        </div>

        {/* Remove Button */}
        <div>
          {canModify ? (
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Remove from shared cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div
              className="p-2 text-slate-300 cursor-not-allowed"
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
