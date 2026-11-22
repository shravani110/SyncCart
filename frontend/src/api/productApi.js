import axiosClient from './axiosClient';

export const productApi = {
  getProducts: async (query = '', category = '') => {
    const params = {};
    if (query) params.query = query;
    if (category) params.category = category;
    const res = await axiosClient.get('/products', { params });
    return res.data;
  },

  getCategories: async () => {
    const res = await axiosClient.get('/products/categories');
    return res.data;
  },

  getProductById: async (id) => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  },
};
