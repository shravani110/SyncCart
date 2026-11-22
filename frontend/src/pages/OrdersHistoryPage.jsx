import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useRoom } from '../context/RoomContext';

export const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useRoom();

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
          <h1 className="text-2xl font-black text-slate-900">Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            All collaborative orders completed across your shopping rooms
          </p>
        </div>
        <Link
          to="/products"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Again</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No orders yet</h3>
          <p className="text-xs text-slate-500">
            Create or join a shopping room with your friends, add items, and checkout to see completed orders here.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
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
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-blue-700">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    Room: <strong className="text-slate-800">{order.roomCode}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
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
                  <span className="text-base font-black text-slate-900 block">
                    {formatCurrency(order.totalAmount, currency)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {order.paymentMethod.replace('_', ' ')}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.orderNumber}`}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
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
