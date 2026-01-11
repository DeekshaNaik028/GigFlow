import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me')
};

// Gigs API
export const gigsAPI = {
  getGigs: (search = '') => api.get(`/api/gigs?search=${search}`),
  getGig: (id) => api.get(`/api/gigs/${id}`),
  createGig: (gigData) => api.post('/api/gigs', gigData),
  updateGig: (id, gigData) => api.put(`/api/gigs/${id}`, gigData),
  deleteGig: (id) => api.delete(`/api/gigs/${id}`),
  getMyGigs: () => api.get('/api/gigs/my/gigs')
};

// Bids API
export const bidsAPI = {
  submitBid: (bidData) => api.post('/api/bids', bidData),
  getBidsForGig: (gigId) => api.get(`/api/bids/${gigId}`),
  hireBid: (bidId) => api.patch(`/api/bids/${bidId}/hire`),
  getMyBids: () => api.get('/api/bids/my/bids')
};

export default api;