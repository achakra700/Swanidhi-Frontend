
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('ls_refresh_token');

      if (refreshToken) {
        try {
          // Attempting token refresh via dedicated endpoint
          // Note: In case of success, the backend should return new token and new refresh token
          const { data } = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
            refreshToken
          });

          const { token, refreshToken: newRefreshToken } = data.data || data;

          localStorage.setItem('ls_token', token);
          if (newRefreshToken) {
            localStorage.setItem('ls_refresh_token', newRefreshToken);
          }

          api.defaults.headers.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - force logout
          localStorage.removeItem('ls_token');
          localStorage.removeItem('ls_refresh_token');
          localStorage.removeItem('ls_user');
          window.location.href = '/#/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle 403 Forbidden or failed refresh
    if (error.response?.status === 403) {
      localStorage.removeItem('ls_token');
      localStorage.removeItem('ls_refresh_token');
      localStorage.removeItem('ls_user');
      window.location.href = '/#/login';
    }

    return Promise.reject(error);
  }
);

export default api;
