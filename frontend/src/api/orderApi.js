import axiosClient from './axiosClient';

export const orderApi = {
  getOrderByNumber: async (orderNumber) => {
    const res = await axiosClient.get(`/orders/${orderNumber}`);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await axiosClient.get('/orders/my-orders');
    return res.data;
  },
};
