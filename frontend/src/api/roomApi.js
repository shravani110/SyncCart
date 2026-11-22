import axiosClient from './axiosClient';

export const roomApi = {
  createRoom: async (name, budgetLimit) => {
    const res = await axiosClient.post('/rooms', { name, budgetLimit });
    return res.data;
  },

  joinRoom: async (roomCode) => {
    const res = await axiosClient.post('/rooms/join', { roomCode });
    return res.data;
  },

  getRoomDetails: async (roomCode) => {
    const res = await axiosClient.get(`/rooms/${roomCode}`);
    return res.data;
  },

  updateBudget: async (roomCode, budgetLimit) => {
    const res = await axiosClient.patch(`/rooms/${roomCode}/budget`, { budgetLimit });
    return res.data;
  },

  removeMember: async (roomCode, userId) => {
    const res = await axiosClient.delete(`/rooms/${roomCode}/members/${userId}`);
    return res.data;
  },

  getMyRooms: async () => {
    const res = await axiosClient.get('/rooms/my-rooms');
    return res.data;
  },

  // Cart operations
  addCartItem: async (roomCode, productId, quantity = 1) => {
    const res = await axiosClient.post(`/rooms/${roomCode}/cart`, { productId, quantity });
    return res.data;
  },

  updateCartItemQuantity: async (roomCode, cartItemId, quantity) => {
    const res = await axiosClient.patch(`/rooms/${roomCode}/cart/${cartItemId}`, { quantity });
    return res.data;
  },

  removeCartItem: async (roomCode, cartItemId) => {
    const res = await axiosClient.delete(`/rooms/${roomCode}/cart/${cartItemId}`);
    return res.data;
  },

  clearCart: async (roomCode) => {
    const res = await axiosClient.delete(`/rooms/${roomCode}/cart`);
    return res.data;
  },

  checkoutRoom: async (roomCode, checkoutData) => {
    const res = await axiosClient.post(`/rooms/${roomCode}/checkout`, checkoutData);
    return res.data;
  },
};
