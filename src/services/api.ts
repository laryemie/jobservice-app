import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend base URL

const api = axios.create({
  baseURL: API_URL,
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

export default api;

const API_URL = 'https://jobservice-backend.onrender.com/api'; // Replace with your Render URL