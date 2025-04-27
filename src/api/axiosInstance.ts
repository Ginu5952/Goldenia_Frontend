import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handling 401 response globally
api.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session has expired
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem('token');
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
