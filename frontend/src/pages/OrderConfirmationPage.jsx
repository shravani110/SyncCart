import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useRoom();

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
    <div className="max-w-5xl xl:max-w-6xl w-full mx-auto py-2 sm:py-6 px-3 sm:px-4 space-y-2.5 sm:space-y-5 animate-fade-in">
      {/* Success Banner - Wide Rectangular Layout */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 flex flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-4 text-left">
          <div className="w-9 h-9 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ring-2 sm:ring-4 ring-emerald-50">
            <CheckCircle2 className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-sm sm:text-2xl font-black text-slate-900 leading-tight">
              Group Order Confirmed!
            </h1>
            <p className="text-[10px] sm:text-sm text-slate-600 line-clamp-1 sm:line-clamp-none">
              The collaborative cart was checked out. A confirmation receipt has been generated.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-200 rounded-full text-[10px] sm:text-xs font-mono font-bold text-emerald-800 shadow-2xs flex-shrink-0">
          <span>#{order.orderNumber}</span>
          <span className="hidden sm:inline">• Room: {order.roomCode}</span>
        </div>
      </div>

      {/* Order Details Card - Wide Rectangular Multi-Column Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3 sm:p-7 shadow-sm space-y-2.5 sm:space-y-5">
        <div className="grid grid-cols-3 gap-2 pb-2.5 sm:pb-4 border-b border-slate-100 text-[10px] sm:text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-0.5">Host Organizer</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{order.hostFullName}</span>
            <span className="text-slate-500 block text-[10px] sm:text-[11px] truncate">@{order.hostUsername}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-0.5">Order Date</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{formatDate(order.createdAt)}</span>
            <span className="text-emerald-700 font-bold block text-[10px] sm:text-[11px]">{order.status}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-0.5">Payment</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{order.paymentMethod.replace('_', ' ')}</span>
            <span className="text-slate-500 block text-[10px] sm:text-[11px] truncate">{order.shippingAddress}</span>
          </div>
        </div>

        {/* 2-Column Grid on Wide Screens for Items & Member Share */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-6">
          {/* Purchased Items */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2.5">
              Purchased Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-1.5 max-h-24 sm:max-h-72 overflow-y-auto pr-1">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-1.5 sm:p-2.5 bg-slate-50 rounded-lg sm:rounded-xl text-[11px] sm:text-xs border border-slate-200/80"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 block truncate">{item.productName}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500">
                      Added by: <strong className="text-blue-700">{item.addedByFullName}</strong> • Qty: {item.quantity} × {formatCurrency(item.unitPrice, currency)}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 whitespace-nowrap">{formatCurrency(item.subtotal, currency)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Member Contribution Breakdown */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2.5">
              Member Share Breakdown
            </h3>
            <div className="space-y-1.5 max-h-20 sm:max-h-72 overflow-y-auto pr-1">
              {order.contributions?.map((c) => (
                <div
                  key={c.username}
                  className="p-1.5 sm:p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg sm:rounded-xl flex items-center justify-between text-[11px] sm:text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{c.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {c.itemsCount} items • {c.percentageOfCart}% of total
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-700 whitespace-nowrap">
                    {formatCurrency(c.totalContribution, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Totals */}
        <div className="pt-2 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-600">Total Paid</span>
          <span className="text-lg sm:text-2xl font-black text-blue-600">
            {formatCurrency(order.totalAmount, currency)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
        <Link
          to="/products"
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 sm:gap-2 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
        <Link
          to="/orders"
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-2xs transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};
