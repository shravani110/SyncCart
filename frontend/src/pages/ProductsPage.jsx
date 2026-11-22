import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Users, ShoppingBag, AlertCircle } from 'lucide-react';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const ProductsPage = ({ onOpenRoomModal }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { room, addItemToCart, liveNotification } = useRoom();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products from server');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Search / Category filter
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts(searchQuery, selectedCategory);
        setProducts(data);
      } catch (err) {
        console.error('Filter failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = async (productId, quantity) => {
    if (!room) {
      onOpenRoomModal();
      return;
    }
    await addItemToCart(productId, quantity);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Live Toast Banner if someone in the room added/removed items */}
      {liveNotification && room && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-white border border-blue-300 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in max-w-sm">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{liveNotification.message}</p>
            <p className="text-[10px] text-blue-600 font-medium">Live Room Sync • {room.roomCode}</p>
          </div>
        </div>
      )}

      {/* Active Room Header Pill */}
      {room ? (
        <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Active Collaborative Room:</span>
                <span className="text-sm font-black text-slate-900">{room.name}</span>
                <span className="text-xs font-mono font-bold bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full shadow-2xs">
                  #{room.roomCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Any item you add will instantly sync to all {room.members?.length || 1} room members
              </p>
            </div>
          </div>

          <Link
            to={`/room/${room.roomCode}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open Room Cart ({room.cartItems?.length || 0})</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">No Active Shopping Room</span>
              <p className="text-xs text-slate-500">
                Join or create a collaborative room to start adding shared items in ₹!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenRoomModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            Create / Join Room
          </button>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, groceries, electronics in ₹..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
