import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Order History</h1>
          <p className="text-xs text-slate-400 mt-1">
            All collaborative orders completed across your shopping rooms
          </p>
        </div>
        <Link
          to="/products"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Again</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No orders yet</h3>
          <p className="text-xs text-slate-400">
            Create or join a shopping room with your friends, add items, and checkout to see completed orders here.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-brand-300">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Room: <strong>{order.roomCode}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(order.createdAt)}
                  </span>
                  <span>•</span>
                  <span>{order.items?.length || 0} items</span>
                  <span>•</span>
                  <span>Host: {order.hostFullName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <span className="text-base font-black text-white block">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {order.paymentMethod.replace('_', ' ')}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.orderNumber}`}
                  className="px-3.5 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <span>Receipt</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
