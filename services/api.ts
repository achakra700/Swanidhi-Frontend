
import axios from 'axios';

const api = axios.create({
  // Fix: Property 'env' does not exist on type 'ImportMeta'. Using process.env to access the environment variables.
  baseURL: process.env.VITE_API_BASE_URL || 'https://api.swanidhi-emergency.gov.in',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ls_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('ls_token');
      localStorage.removeItem('ls_user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;
