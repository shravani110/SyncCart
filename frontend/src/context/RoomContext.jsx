import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { roomApi } from '../api/roomApi';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from './AuthContext';

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeRoomCode, setActiveRoomCode] = useState(() => {
    return localStorage.getItem('synccart_active_room') || null;
  });
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('synccart_currency') || 'INR';
  });
  const setCurrency = (newCurr) => {
    setCurrencyState(newCurr);
    localStorage.setItem('synccart_currency', newCurr);
  };
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveNotification, setLiveNotification] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Clear live notification after 4 seconds
  useEffect(() => {
    if (liveNotification) {
      const timer = setTimeout(() => {
        setLiveNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [liveNotification]);

  // Handle incoming STOMP WebSocket messages
  const handleWebSocketMessage = useCallback((msg) => {
    console.log('[WebSocket Message Received]', msg);

    // Show live alert banner & update activity feed
    if (msg.message) {
      const newEntry = {
        id: Date.now() + Math.random(),
        type: msg.type?.toLowerCase() || 'info',
        message: msg.message,
        sender: msg.senderFullName || msg.senderUsername,
        timestamp: msg.timestamp || new Date().toISOString(),
      };
      setLiveNotification(newEntry);
      setActivityFeed((prev) => [newEntry, ...prev.filter((e) => e.message !== msg.message)].slice(0, 30));
    }

    // CHECKOUT_COMPLETED must be handled FIRST so orderDto is not mistaken for a room payload
    if (msg.type === 'CHECKOUT_COMPLETED' && msg.payload) {
      setRoom((prev) => (prev ? { ...prev, status: 'CHECKED_OUT', cartItems: [], totalCartAmount: 0 } : null));
      setCompletedOrder(msg.payload);
      try {
        sessionStorage.setItem('synccart_latest_order', JSON.stringify(msg.payload));
      } catch (e) {}
      return;
    }

    // If message contains updated room details payload (must not be an order payload)
    if (msg.payload && typeof msg.payload === 'object' && msg.payload.roomCode && !msg.payload.orderNumber) {
      setRoom(msg.payload);
    } else {
      // Fallback: fetch latest room state
      if (activeRoomCode) {
        roomApi.getRoomDetails(activeRoomCode)
          .then((data) => setRoom(data))
          .catch((err) => console.error("Error refreshing room after WS:", err));
      }
    }
  }, [activeRoomCode]);

  // Hook into WebSocket
  const { isConnected } = useWebSocket(activeRoomCode, handleWebSocketMessage);

  // Fetch room data whenever activeRoomCode or authentication changes
  const fetchRoomData = useCallback(async (code) => {
    if (!code || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await roomApi.getRoomDetails(code);
      setRoom(data);
      if (data && data.cartItems && data.cartItems.length > 0) {
        const initialActivities = data.cartItems.map((item) => ({
          id: item.id,
          type: 'success',
          message: `${item.addedByFullName || item.addedByUsername} added ${item.quantity}x ${item.productName}`,
          sender: item.addedByFullName || item.addedByUsername,
          timestamp: item.updatedAt || new Date().toISOString(),
        }));
        setActivityFeed((prev) => (prev.length === 0 ? initialActivities : prev));
      }
      localStorage.setItem('synccart_active_room', code);
    } catch (err) {
      console.error('Failed to load room details:', err);
      setError(err.response?.data?.message || 'Failed to load room details');
      setRoom(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeRoomCode && isAuthenticated) {
      fetchRoomData(activeRoomCode);
    } else if (!isAuthenticated) {
      setRoom(null);
    }
  }, [activeRoomCode, isAuthenticated, fetchRoomData]);

  // Switch / Join room
  const enterRoom = async (code) => {
    const upperCode = code.trim().toUpperCase();
    setActiveRoomCode(upperCode);
    await fetchRoomData(upperCode);
  };

  const createRoom = async (name, budgetLimit) => {
    const data = await roomApi.createRoom(name, budgetLimit);
    setActiveRoomCode(data.roomCode);
    setRoom(data);
    localStorage.setItem('synccart_active_room', data.roomCode);
    return data;
  };

  const joinRoomByCode = async (code) => {
    const data = await roomApi.joinRoom(code);
    setActiveRoomCode(data.roomCode);
    setRoom(data);
    localStorage.setItem('synccart_active_room', data.roomCode);
    return data;
  };

  const leaveRoom = async () => {
    if (room && user) {
      try {
        await roomApi.removeMember(room.roomCode, user.id);
      } catch (e) {
        console.warn('Error during leave room call:', e);
      }
    }
    setActiveRoomCode(null);
    setRoom(null);
    localStorage.removeItem('synccart_active_room');
  };

  // Cart operations
  const addItemToCart = async (productId, quantity = 1) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.addCartItem(activeRoomCode, productId, quantity);
    setRoom(updated);
    return updated;
  };

  const updateItemQty = async (cartItemId, quantity) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.updateCartItemQuantity(activeRoomCode, cartItemId, quantity);
    setRoom(updated);
    return updated;
  };

  const removeItemFromCart = async (cartItemId) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.removeCartItem(activeRoomCode, cartItemId);
    setRoom(updated);
    return updated;
  };

  const clearRoomCart = async () => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.clearCart(activeRoomCode);
    setRoom(updated);
    return updated;
  };

  const updateRoomBudget = async (newBudget) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.updateBudget(activeRoomCode, newBudget);
    setRoom(updated);
    return updated;
  };

  const removeRoomMember = async (userId) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const updated = await roomApi.removeMember(activeRoomCode, userId);
    setRoom(updated);
    return updated;
  };

  const checkoutRoom = async (checkoutData) => {
    if (!activeRoomCode) throw new Error("No active room selected");
    const order = await roomApi.checkoutRoom(activeRoomCode, checkoutData);
    setRoom((prev) => prev ? { ...prev, status: 'CHECKED_OUT', cartItems: [], totalCartAmount: 0 } : null);
    return order;
  };

  // Accurately determine the logged-in user's membership and host status
  const currentMember = useMemo(() => {
    if (!room || !user) return null;
    const uid = user.id != null ? Number(user.id) : null;
    return (
      room.members?.find((m) => {
        if (uid !== null && m.userId != null && Number(m.userId) === uid) return true;
        if (m.username && user.username && m.username.toLowerCase() === user.username.toLowerCase()) return true;
        return false;
      }) || null
    );
  }, [room?.members, user?.id, user?.username]);

  const isHost = useMemo(() => {
    if (!room || !user) return false;
    const hostId = room.hostId != null ? Number(room.hostId) : null;
    const userId = user.id != null ? Number(user.id) : null;
    if (hostId !== null && userId !== null && hostId === userId) {
      return true;
    }
    if (room.hostUsername && user.username && room.hostUsername.toLowerCase() === user.username.toLowerCase()) {
      return true;
    }
    if (currentMember && currentMember.roomRole === 'HOST') {
      return true;
    }
    return false;
  }, [room?.hostId, room?.hostUsername, user?.id, user?.username, currentMember]);

  return (
    <RoomContext.Provider
      value={{
        activeRoomCode,
        currency,
        setCurrency,
        room,
        loading,
        error,
        isConnected,
        isHost,
        currentMember,
        liveNotification,
        activityFeed,
        enterRoom,
        createRoom,
        joinRoomByCode,
        leaveRoom,
        refreshRoom: () => fetchRoomData(activeRoomCode),
        addItemToCart,
        updateItemQty,
        removeItemFromCart,
        clearRoomCart,
        updateRoomBudget,
        completedOrder,
        clearCompletedOrder: () => setCompletedOrder(null),
        removeRoomMember,
        checkoutRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
