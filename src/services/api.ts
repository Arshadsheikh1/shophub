import axios from 'axios';

/* =====================
   BASE AXIOS INSTANCE
===================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* =====================
   REQUEST INTERCEPTOR
===================== */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =====================
   RESPONSE INTERCEPTOR
   (FIXED AUTO RELOAD LOOP)
===================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {

      // prevent infinite reload loop
      if (!window.location.pathname.includes('/login')) {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/* =====================
   AUTH APIs
===================== */

export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  adminLogin: (data: { email: string; password: string }) =>
    api.post('/auth/admin/login', data),
};

/* =====================
   PRODUCT APIs (USER)
===================== */

export const productAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
};

/* =====================
   CART APIs
===================== */

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number) =>
    api.post('/cart/add', { productId, quantity }),
  updateCart: (productId: string, quantity: number) =>
    api.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId: string) =>
    api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

/* =====================
   ORDER APIs
===================== */

export const orderAPI = {
  createOrder: (data: any) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/my'),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
};

/* =====================
   ADMIN APIs
===================== */

export const adminAPI = {
  /* ----- PRODUCTS (admin-only for write) ----- */
  products: {
    // Public GET (same route as user)
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),

    // Create / update / delete require admin token (handled by backend)
    create: (data: FormData) =>
      api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    update: (id: string, data: FormData) =>
      api.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    delete: (id: string) => api.delete(`/products/${id}`),
  },

  /* ----- CATEGORIES (admin-only for write) ----- */
  categories: {
    getAll: () => api.get('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: { name: string }) => api.post('/categories', data),
    update: (id: string, data: { name: string }) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
  },

  /* ----- DASHBOARD ----- */
  dashboard: () => api.get('/admin/dashboard'),

  /* ----- ORDERS (admin dashboard & management) ----- */
  orders: {
    // List all orders with optional filters: status, paymentStatus, userId, page, limit
    getAll: (params?: any) => api.get('/orders', { params }),

    // Single order (admin can see any; backend enforces permissions)
    getById: (id: string) => api.get(`/orders/${id}`),

    // Update order status from admin panel
    updateStatus: (id: string, newStatus: string) =>
      api.put(`/orders/${id}/status`, { orderStatus: newStatus }),

    // Aggregate stats for reports / dashboards
    getStats: () => api.get('/orders/stats/summary'),
  },
};

export default api;
