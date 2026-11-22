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
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Group Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          The collaborative cart was checked out. A confirmation receipt has been generated for all room members.
        </p>
        <div className="pt-2 inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-200 rounded-full text-xs font-mono font-bold text-emerald-800 shadow-2xs">
          <span>Order #{order.orderNumber}</span>
          <span>•</span>
          <span className="text-slate-500">Room: {order.roomCode}</span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-1">Host Organizer</span>
            <span className="font-bold text-slate-900 text-sm">{order.hostFullName}</span>
            <span className="text-slate-500 block text-[11px]">@{order.hostUsername}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1">Order Date</span>
            <span className="font-bold text-slate-900 text-sm">{formatDate(order.createdAt)}</span>
            <span className="text-emerald-700 font-bold block text-[11px]">{order.status}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1">Payment Method</span>
            <span className="font-bold text-slate-900 text-sm">{order.paymentMethod.replace('_', ' ')}</span>
            <span className="text-slate-500 block text-[11px] truncate">{order.shippingAddress}</span>
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
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs border border-slate-200/80"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{item.productName}</span>
                  <span className="text-[11px] text-slate-500">
                    Added by: <strong className="text-blue-700">{item.addedByFullName}</strong> • Qty: {item.quantity} × {formatCurrency(item.unitPrice, currency)}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">{formatCurrency(item.subtotal, currency)}</span>
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
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{c.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {c.itemsCount} items • {c.percentageOfCart}% of total
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-700">
                    {formatCurrency(c.totalContribution, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Totals */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Total Paid</span>
          <span className="text-2xl font-black text-blue-600">
            {formatCurrency(order.totalAmount, currency)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/products"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-2xs transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};
