import axios from 'axios';
import { AuthResponse, Product, Category, Cart, Order, Review, Complaint } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, matKhau: string, vaiTro: string) =>
    api.post<AuthResponse>('/auth/register', { email, matKhau, vaiTro }),
  login: (email: string, matKhau: string) =>
    api.post<AuthResponse>('/auth/login', { email, matKhau }),
};

export const productsAPI = {
  getAll: (search?: string, danhMucId?: string) =>
    api.get<Product[]>('/products', { params: { search, danhMucId } }),
  getOne: (id: string) => api.get<Product>(`/products/${id}`),
  getMyProducts: () => api.get<Product[]>('/products/seller/my-products'),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  uploadImages: (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    return api.post<{ urls: string[] }>('/products/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const categoriesAPI = {
  getAll: () => api.get<Category[]>('/categories'),
  getOne: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get<Cart>('/cart'),
  add: (sanPhamId: string, soLuong: number) => api.post('/cart', { sanPhamId, soLuong }),
  update: (id: string, soLuong: number) => api.put(`/cart/${id}`, { soLuong }),
  remove: (id: string) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

export const ordersAPI = {
  create: (phuongThucThanhToan: string) => api.post<Order>('/orders', { phuongThucThanhToan }),
  getAll: () => api.get<Order[]>('/orders'),
  getOne: (id: string) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: string, trangThai: string) => api.put(`/orders/${id}/status`, { trangThai }),
};

export const reviewsAPI = {
  create: (data: Partial<Review>) => api.post<Review>('/reviews', data),
  getBySanPham: (sanPhamId: string) => api.get<Review[]>(`/reviews/product/${sanPhamId}`),
  getMyReviews: () => api.get<Review[]>('/reviews/my-reviews'),
};

export const complaintsAPI = {
  create: (data: Partial<Complaint>) => api.post<Complaint>('/complaints', data),
  getAll: () => api.get<Complaint[]>('/complaints'),
  getMy: () => api.get<Complaint[]>('/complaints/my-complaints'),
  getOne: (id: string) => api.get<Complaint>(`/complaints/${id}`),
  updateStatus: (id: string, trangThai: string) =>
    api.put(`/complaints/${id}/status`, { trangThai }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/customer/profile'),
  updateProfile: (data: any) => api.put('/users/customer/profile', data),
  getSellerProfile: () => api.get('/users/seller/profile'),
  updateSellerProfile: (data: any) => api.put('/users/seller/profile', data),
  getSellers: () => api.get('/users/sellers'),
  approveSeller: (id: string) => api.put(`/users/sellers/${id}/approve`),
  rejectSeller: (id: string) => api.put(`/users/sellers/${id}/reject`),
};

export default api;
