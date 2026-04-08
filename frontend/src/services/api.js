// API Service - Centralized API calls connected to the Node.js/Express backend
import axios from 'axios';

// Base API URL - points to the Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add auth token to requests
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

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ============ AUTH API ============
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (name, email, password, role = 'Receptionist') => {
        const response = await api.post('/auth/register', { name, email, password, role });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// ============ DASHBOARD API ============
export const dashboardAPI = {
    getSummary: async () => {
        const response = await api.get('/dashboard/summary');
        return response.data;
    }
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
    predict: async (patients) => {
        const response = await api.post('/analytics/predict', { patients });
        return response.data;
    },

    getDailyData: async (days = 30) => {
        const response = await api.get(`/analytics/daily?days=${days}`);
        return response.data;
    },

    saveDailyData: async (data) => {
        const response = await api.post('/analytics/daily', data);
        return response.data;
    }
};

// ============ RESOURCES API ============
export const resourcesAPI = {
    getAll: async (category = null) => {
        const url = category ? `/resources?category=${category}` : '/resources';
        const response = await api.get(url);
        return response.data;
    },

    create: async (resourceData) => {
        const response = await api.post('/resources', resourceData);
        return response.data;
    },

    update: async (id, resourceData) => {
        const response = await api.put(`/resources/${id}`, resourceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
};

// ============ EMERGENCY API ============
export const emergencyAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/emergency${params ? '?' + params : ''}`);
        return response.data;
    },

    create: async (caseData) => {
        const response = await api.post('/emergency', caseData);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/emergency/${id}/status`, { status });
        return response.data;
    }
};

export default api;
