import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, CreditCard, Users, ArrowRight, Printer } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderApi.getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError('Order not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Loading order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-slate-800/80 border border-slate-700 rounded-3xl text-center space-y-4">
        <h3 className="text-base font-bold text-white">Order Not Found</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <Link
          to="/products"
          className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      {/* Success Banner */}
      <div className="bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Group Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          The collaborative cart was checked out. A confirmation receipt has been generated for all room members.
        </p>
        <div className="pt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-700 rounded-full text-xs font-mono font-bold text-brand-300">
          <span>Order #{order.orderNumber}</span>
          <span>•</span>
          <span className="text-slate-400">Room: {order.roomCode}</span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Host Organizer</span>
            <span className="font-bold text-white text-sm">{order.hostFullName}</span>
            <span className="text-slate-400 block text-[11px]">@{order.hostUsername}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Order Date</span>
            <span className="font-bold text-white text-sm">{formatDate(order.createdAt)}</span>
            <span className="text-emerald-400 font-semibold block text-[11px]">{order.status}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Payment Method</span>
            <span className="font-bold text-white text-sm">{order.paymentMethod.replace('_', ' ')}</span>
            <span className="text-slate-400 block text-[11px] truncate">{order.shippingAddress}</span>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Purchased Items ({order.items?.length || 0})
          </h3>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl text-xs border border-slate-700/40"
              >
                <div>
                  <span className="font-bold text-white block">{item.productName}</span>
                  <span className="text-[11px] text-slate-400">
                    Added by: <strong className="text-brand-300">{item.addedByFullName}</strong> • Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                </div>
                <span className="font-bold text-white">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Contribution Breakdown */}
        {order.contributions?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Member Share Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.contributions.map((c) => (
                <div
                  key={c.username}
                  className="p-3 bg-slate-900/60 border border-slate-700/40 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{c.fullName}</span>
                    <span className="text-[10px] text-slate-400">
                      {c.itemsCount} items • {c.percentageOfCart}% of total
                    </span>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(c.totalContribution)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Totals */}
        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Total Paid</span>
          <span className="text-2xl font-black text-brand-300">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/products"
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};
