import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // adjust if necessary based on your backend '/api' prefix configuration
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
