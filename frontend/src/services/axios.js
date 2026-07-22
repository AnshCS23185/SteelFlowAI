import axios from 'axios';

// Module 1 is on port 8001, so we should change this to 8001
const api = axios.create({
  baseURL: 'http://localhost:8001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (error.response && error.response.status === 401) {
      // Clear all auth state to prevent ghost sessions
      localStorage.removeItem('token');
      sessionStorage.removeItem('steelflow-user');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('name');
      
      // Force redirect to login page if we aren't already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
