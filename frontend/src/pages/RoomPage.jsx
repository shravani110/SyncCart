import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  CreditCard,
  Plus,
  Sparkles,
  AlertTriangle,
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
import { ActivityFeed } from '../components/ActivityFeed';
import { ProductDetailModal } from '../components/ProductDetailModal';
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
    activityFeed,
    enterRoom,
    addItemToCart,
    updateItemQty,
    removeItemFromCart,
    clearRoomCart,
    updateRoomBudget,
    removeRoomMember,
    checkoutRoom,
    leaveRoom,
    currency,
  } = useRoom();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [leavingRoom, setLeavingRoom] = useState(false);

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

  const handleConfirmClearCart = async () => {
    setClearingCart(true);
    setShowClearConfirm(false);
    try {
      await clearRoomCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setClearingCart(false);
    }
  };

  const handleConfirmLeave = async () => {
    setLeavingRoom(true);
    try {
      await leaveRoom();
      navigate('/products');
    } catch (err) {
      console.error(err);
    } finally {
      setLeavingRoom(false);
      setShowLeaveConfirm(false);
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Connecting to shopping room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Room Error</h3>
        <p className="text-xs text-slate-500">{error || 'Shopping room not found or expired.'}</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  const cartItems = room.cartItems || [];

  return (
    <div className="space-y-4 py-2 sm:py-3">
      {/* Live STOMP Event Notification Banner */}
      {liveNotification && (
        <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-sm flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 text-white rounded-lg">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{liveNotification.message}</p>
              <p className="text-[10px] text-blue-700 font-medium">Live Synchronized Update across all room members</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full shadow-2xs">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Left: Synchronized Cart Items */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Synchronized Cart Items
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.2 rounded-full font-bold">
                      {cartItems.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Items added by any member update here live
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to="/products"
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Products</span>
                </Link>

                {isHost && cartItems.length > 0 && (
                  showClearConfirm ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 py-1 px-2 rounded-xl animate-fade-in shadow-2xs">
                      <span className="text-[11px] font-bold text-rose-800">Clear all?</span>
                      <button
                        type="button"
                        onClick={handleConfirmClearCart}
                        disabled={clearingCart}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition"
                      >
                        {clearingCart ? '...' : 'Yes, Clear'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Host privilege: Clear entire cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Cart</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3 min-h-[300px]">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mx-auto flex items-center justify-center shadow-2xs">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Your room cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse the catalog and add products. Every item you add will appear instantly on everyone's screen!
                </p>
                <div className="pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    currentUserId={user?.id}
                    isHost={isHost}
                    onUpdateQuantity={handleUpdateQty}
                    onRemoveItem={handleRemoveItem}
                    onSelectProduct={(it) =>
                      setSelectedProduct({
                        id: it.productId,
                        name: it.productName,
                        category: it.productCategory,
                        price: it.unitPrice,
                        imageUrl: it.productImageUrl,
                        description: `Item in room cart. Added by ${it.addedByFullName || it.addedByUsername}.`,
                      })
                    }
                  />
                ))}
              </div>
            )}

            {/* Checkout Action Bar */}
            {cartItems.length > 0 && (
              <div className="mt-auto pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Total Cart Value</span>
                  <span className="text-2xl font-black text-slate-900">
                    {formatCurrency(room.totalCartAmount, currency)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {isHost ? (
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl font-medium">
                      Waiting for Host ({room.hostFullName}) to initiate checkout
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Member Contributions & Activity Feed & Room Actions */}
        <div className="space-y-4">
          <MemberSplitSummary
            room={room}
            currentUserId={user?.id}
            isHost={isHost}
            onRemoveMember={removeRoomMember}
          />

          {/* Real-time Activity Feed from Reference Design */}
          <ActivityFeed activities={activityFeed} />

          {/* Room Controls Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Room Settings & Permissions
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Your Room Role</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${isHost ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                  {isHost ? 'Host (Admin)' : 'Member'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Active Members</span>
                <span className="font-bold text-slate-900">{room.members?.length || 1}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Room Status</span>
                <span className="font-bold text-emerald-700">{room.status}</span>
              </div>
            </div>

            <div className="pt-1">
              {showLeaveConfirm ? (
                <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-xl space-y-2 text-center animate-fade-in shadow-2xs">
                  <div className="flex items-center justify-center gap-1.5 text-rose-800 font-bold text-xs">
                    <DoorOpen className="w-4 h-4 text-rose-600" />
                    <span>Leave this shopping room?</span>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-snug">
                    You will exit this shared shopping session. You can re-join anytime using the room code.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowLeaveConfirm(false)}
                      disabled={leavingRoom}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmLeave}
                      disabled={leavingRoom}
                      className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition active:scale-[0.98]"
                    >
                      {leavingRoom ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <DoorOpen className="w-3.5 h-3.5" />
                      )}
                      <span>Yes, Leave Room</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 flex items-center justify-center gap-1.5 transition"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Leave Shopping Room</span>
                </button>
              )}
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(pid, q) => addItemToCart(pid, q)}
      />
    </div>
  );
};
