import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useRoom();
  const { user } = useAuth();

  const currentUsername = user?.username;
  const isHost = order && user && (order.hostUsername === user.username || order.hostId === user.id);
  const myContribution = order?.contributions?.find((c) => c.username === currentUsername);

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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500">Loading order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
        <p className="text-xs text-slate-500">{error}</p>
        <Link
          to="/products"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-2xs"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl xl:max-w-6xl w-full mx-auto py-2.5 sm:py-6 px-1 sm:px-4 gap-3 sm:gap-5 animate-fade-in">
      {/* Success Banner - Wide Rectangular Layout */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex items-center justify-between gap-3 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ring-3 sm:ring-4 ring-emerald-50">
            <CheckCircle2 className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-sm sm:text-2xl font-black text-slate-900 leading-snug">
              Group Order Confirmed!
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-600">
              The collaborative cart was checked out. A receipt has been generated.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-white border border-emerald-200 rounded-full text-[11px] sm:text-xs font-mono font-bold text-emerald-800 shadow-2xs flex-shrink-0">
          <span>#{order.orderNumber}</span>
          <span className="hidden sm:inline">• Room: {order.roomCode}</span>
        </div>
      </div>

      {/* Order Details Card - Expands to Fill Vertical Screen Space Gracefully */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-sm flex flex-col justify-between gap-3 sm:gap-5 min-h-0">
        {/* Personalized Member Share Status */}
        {user && (
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs bg-blue-50/80 border-blue-200 text-blue-950 flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 bg-white rounded-xl text-blue-600 border border-blue-200 shadow-2xs flex-shrink-0">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="font-bold block">
                  {order.paymentMethod === 'HOST_PAY'
                    ? (isHost ? 'You paid the entire group cart as Host.' : `Covered by Host (${order.hostFullName})`)
                    : order.paymentMethod === 'EQUAL_PAY'
                    ? 'Equal Split (split equally across all members)'
                    : 'Smart Split Pay (based on your added items)'}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 block">
                  {order.paymentMethod === 'HOST_PAY'
                    ? (isHost ? 'Full invoice finalized and paid by you.' : 'You owe Rs. 0.00 — Host covered your items.')
                    : 'Your individual calculated share for this order.'}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 block">Your Share</span>
              <span className="text-base sm:text-xl font-black text-blue-700">
                {order.paymentMethod === 'HOST_PAY' && !isHost
                  ? formatCurrency(0, currency)
                  : formatCurrency(myContribution ? myContribution.totalContribution : (isHost ? order.totalAmount : 0), currency)}
              </span>
            </div>
          </div>
        )}

        {/* Info Grid - 2 cols on mobile to avoid awkward truncation, 3 cols on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 pb-2.5 sm:pb-4 border-b border-slate-100 text-xs flex-shrink-0">
          <div>
            <span className="text-slate-400 font-medium block mb-0.5 text-[11px] sm:text-xs">Host Organizer</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block">{order.hostFullName}</span>
            <span className="text-slate-500 block text-[11px]">@{order.hostUsername}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-0.5 text-[11px] sm:text-xs">Order Date</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block">{formatDate(order.createdAt)}</span>
            <span className="text-emerald-700 font-bold block text-[11px]">{order.status}</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 font-medium block mb-0.5 text-[11px] sm:text-xs">Payment Method</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block">{order.paymentMethod.replace('_', ' ')}</span>
            <span className="text-slate-500 block text-[11px] truncate">{order.shippingAddress}</span>
          </div>
        </div>

        {/* 2-Column Grid on Wide Screens for Items & Member Share */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 min-h-0">
          {/* Purchased Items */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex-shrink-0">
              Purchased Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-48 sm:max-h-72">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 rounded-xl text-xs border border-slate-200/80"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 block truncate text-xs sm:text-sm">{item.productName}</span>
                    <span className="text-[11px] text-slate-500">
                      Added by: <strong className="text-blue-700">{item.addedByFullName}</strong> • Qty: {item.quantity} × {formatCurrency(item.unitPrice, currency)}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm whitespace-nowrap">{formatCurrency(item.subtotal, currency)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Member Contribution Breakdown */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex-shrink-0">
              Member Share Breakdown
            </h3>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-40 sm:max-h-72">
              {order.contributions?.map((c) => (
                <div
                  key={c.username}
                  className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block text-xs sm:text-sm">{c.fullName}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {c.itemsCount} items • {c.percentageOfCart}% of total
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(c.totalContribution, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Totals */}
        <div className="pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <span className="text-xs sm:text-sm font-bold text-slate-600">Total Paid</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600">
            {formatCurrency(order.totalAmount, currency)}
          </span>
        </div>
      </div>

      {/* Action Buttons - 2 columns on mobile, flex on sm+ */}
      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-center sm:gap-4 flex-shrink-0">
        <Link
          to="/products"
          className="py-2.5 sm:py-2.5 px-3 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 sm:gap-2 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
        <Link
          to="/orders"
          className="py-2.5 sm:py-2.5 px-3 sm:px-6 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 shadow-2xs flex items-center justify-center transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};
