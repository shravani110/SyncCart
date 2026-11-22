import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';

let API_BASE_URL = 'http://localhost:8080/api';
if (rawApiUrl) {
  const cleaned = rawApiUrl.replace(/\/+$/, '');
  API_BASE_URL = cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('synccart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register endpoints
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('synccart_token');
        localStorage.removeItem('synccart_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
