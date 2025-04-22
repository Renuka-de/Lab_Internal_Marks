import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend URL
});

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get JWT from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
