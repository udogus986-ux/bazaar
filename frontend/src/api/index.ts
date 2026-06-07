import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH ---
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// --- PRODUCTS ---
export const productAPI = {
  getAll: (params?: { category?: string; search?: string }) =>
    api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: object) => api.post('/products', data),
  update: (id: string, data: object) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// --- CART ---
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId: string, quantity: number) =>
    api.post('/cart', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// --- ORDERS ---
export const orderAPI = {
  create: (data?: { addressId?: string }) => api.post('/orders', data || {}),
  getMyOrders: () => api.get('/orders/my'),
  getAll: () => api.get('/orders'),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

// --- ADDRESSES ---
export const addressAPI = {
  getAll: () => api.get('/addresses'),
  create: (data: {
    title: string; fullName: string; phone: string
    city: string; district: string; address: string
    zipCode?: string; isDefault?: boolean
  }) => api.post('/addresses', data),
  update: (id: string, data: object) => api.put(`/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/addresses/${id}`),
  setDefault: (id: string) => api.put(`/addresses/${id}/default`),
};

export default api;