import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, MapPin, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatters';

export const CheckoutModal = ({
  isOpen,
  onClose,
  room,
  isHost,
  onFinalizeCheckout,
}) => {
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Innovation Park');
  const [paymentMethod, setPaymentMethod] = useState('SPLIT_PAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !room) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isHost) {
      setError('Only the room Host can finalize checkout');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const order = await onFinalizeCheckout({
        shippingAddress,
        paymentMethod,
      });

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onClose(order);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Finalize Shared Order</h3>
              <p className="text-xs text-slate-400">Review items & finalize group order</p>
            </div>
          </div>
          <button
            onClick={() => onClose()}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cart Item Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Order Items ({room.cartItems?.length || 0})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {room.cartItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl text-xs border border-slate-700/40"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-semibold text-white block">{item.productName}</span>
                      <span className="text-[11px] text-slate-400">
                        Qty: {item.quantity} • Added by {item.addedByFullName}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-white">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Split Contributions Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Member Split Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.contributions?.map((c) => (
                <div
                  key={c.username}
                  className="p-3 bg-slate-900/60 border border-slate-700/40 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{c.fullName}</span>
                    <span className="text-[10px] text-slate-400">
                      {c.itemsCount} items ({c.percentageOfCart}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white block">
                      {formatCurrency(c.totalContribution)}
                    </span>
                    <span className="text-[10px] text-brand-300">
                      Split target: {formatCurrency(room.perMemberEqualSplit)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              Delivery Address
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter shipping address"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-400" />
              Group Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'SPLIT_PAY', title: 'Smart Split Pay', desc: 'Each member pays their share' },
                { id: 'EQUAL_PAY', title: 'Equal 50/50 Split', desc: 'Total divided by member count' },
                { id: 'HOST_PAY', title: 'Host Pays All', desc: 'Host pays total invoice' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === opt.id
                      ? 'bg-brand-950/60 border-brand-500 text-white ring-1 ring-brand-500'
                      : 'bg-slate-900/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold block">{opt.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/60 space-y-2 text-sm">
            <div className="flex justify-between text-slate-300 text-xs">
              <span>Cart Subtotal</span>
              <span>{formatCurrency(room.totalCartAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-xs">
              <span>Standard Shipping</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-slate-300 text-xs">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex justify-between text-base font-extrabold text-white">
              <span>Total Amount</span>
              <span className="text-brand-300">{formatCurrency(room.totalCartAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/80 bg-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          {isHost ? (
            <button
              onClick={handleCheckout}
              disabled={loading || !room.cartItems?.length}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Place Group Order</span>
                </>
              )}
            </button>
          ) : (
            <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              Only the room Host ({room.hostFullName}) can confirm and place the order.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
