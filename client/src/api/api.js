import axios from 'axios';

// URL gốc của backend
const API_URL = '/api'; // Chỉ cần dùng đường dẫn tương đối

const api = axios.create({
  baseURL: API_URL
});

// Đây là "Interceptor" - nó sẽ chạy trước MỌI request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu có token, gắn nó vào header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;