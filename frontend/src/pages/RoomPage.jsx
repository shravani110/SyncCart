import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Users,
  CreditCard,
  Plus,
  Sparkles,
  AlertTriangle,
  Radio,
  DoorOpen,
  ArrowRight
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import { BudgetProgressBar } from '../components/BudgetProgressBar';
import { MemberSplitSummary } from '../components/MemberSplitSummary';
import { ActiveMembersBadge } from '../components/ActiveMembersBadge';
import { CartItemRow } from '../components/CartItemRow';
import { CheckoutModal } from '../components/CheckoutModal';
import { formatCurrency } from '../utils/formatters';

export const RoomPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    room,
    loading,
    error,
    isConnected,
    isHost,
    liveNotification,
    enterRoom,
    updateItemQty,
    removeItemFromCart,
    clearRoomCart,
    updateRoomBudget,
    removeRoomMember,
    checkoutRoom,
    leaveRoom,
  } = useRoom();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    if (roomCode) {
      enterRoom(roomCode);
    }
  }, [roomCode]);

  const handleUpdateQty = async (cartItemId, newQty) => {
    try {
      await updateItemQty(cartItemId, newQty);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeItemFromCart(cartItemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear the entire room cart?')) return;
    setClearingCart(true);
    try {
      await clearRoomCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setClearingCart(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Leave this shopping room?')) return;
    try {
      await leaveRoom();
      navigate('/products');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutSuccess = (order) => {
    setCheckoutModalOpen(false);
    if (order && order.orderNumber) {
      navigate(`/orders/${order.orderNumber}`);
    } else {
      navigate('/orders');
    }
  };

  if (loading && !room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Connecting to shopping room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-slate-800/80 border border-slate-700/80 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Room Error</h3>
        <p className="text-xs text-slate-400">{error || 'Shopping room not found or expired.'}</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  const cartItems = room.cartItems || [];

  return (
    <div className="space-y-8 py-6">
      {/* Live STOMP Event Notification Banner */}
      {liveNotification && (
        <div className="p-4 bg-gradient-to-r from-brand-950/90 via-indigo-950/90 to-slate-900/90 border border-brand-500/50 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 text-brand-300 rounded-xl">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{liveNotification.message}</p>
              <p className="text-[10px] text-slate-400">Live Synchronized Update across all room members</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">
            REAL-TIME
          </span>
        </div>
      )}

      {/* Active Members Banner & Live Status */}
      <ActiveMembersBadge room={room} isConnected={isConnected} />

      {/* Shared Budget Progress Bar */}
      <BudgetProgressBar
        room={room}
        isHost={isHost}
        onUpdateBudget={updateRoomBudget}
      />

      {/* Main Grid: Cart Items (Left 2 cols) & Split Summary (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Synchronized Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Synchronized Cart Items
                    <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-bold">
                      {cartItems.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Items added by any member update here live
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to="/products"
                  className="px-3 py-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Products</span>
                </Link>

                {isHost && cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Host privilege: Clear entire cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-700/40 text-slate-500 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Your room cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Browse the catalog and add products. Every item you add will appear instantly on everyone's screen!
                </p>
                <div className="pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-brand-600/25"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    currentUserId={user?.id}
                    isHost={isHost}
                    onUpdateQuantity={handleUpdateQty}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
            )}

            {/* Checkout Action Bar */}
            {cartItems.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Total Cart Value</span>
                  <span className="text-2xl font-black text-white">
                    {formatCurrency(room.totalCartAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {isHost ? (
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xl shadow-brand-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                      Waiting for Host ({room.hostFullName}) to initiate checkout
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Member Contributions & Room Actions */}
        <div className="space-y-6">
          <MemberSplitSummary
            room={room}
            currentUserId={user?.id}
            isHost={isHost}
            onRemoveMember={removeRoomMember}
          />

          {/* Room Controls Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Room Settings & Permissions
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 flex items-center justify-between">
                <span className="text-slate-400">Your Room Role</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${isHost ? 'bg-amber-400/20 text-amber-300' : 'bg-brand-500/20 text-brand-300'}`}>
                  {isHost ? 'Host (Admin)' : 'Member'}
                </span>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 flex items-center justify-between">
                <span className="text-slate-400">Total Active Members</span>
                <span className="font-bold text-white">{room.members?.length || 1}</span>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 flex items-center justify-between">
                <span className="text-slate-400">Room Status</span>
                <span className="font-bold text-emerald-400">{room.status}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLeaveRoom}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-slate-700 hover:border-rose-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Leave Shopping Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={handleCheckoutSuccess}
        room={room}
        isHost={isHost}
        onFinalizeCheckout={checkoutRoom}
      />
    </div>
  );
};
