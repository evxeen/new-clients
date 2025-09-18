// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: window.location.origin, // без /api
    withCredentials: false,
});

// подставляем токен из localStorage в каждый запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// при 401 можно автоматически выкинуть пользователя
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            // удобный быстрый редирект на логин
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default api;
