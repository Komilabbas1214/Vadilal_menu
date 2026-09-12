import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Interceptor to append Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
