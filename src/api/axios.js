import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://api.etkinlik.in' : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Token varsa Authorization header'ına ekle
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Burada 401 Unauthorized gibi global hataları yakalayabilirsiniz
    if (error.response && error.response.status === 401) {
      // Örn: token süresi dolmuşsa çıkış yap veya login sayfasına yönlendir
      console.warn("Yetkisiz erişim - 401");
    }
    return Promise.reject(error);
  }
);

export default api;
