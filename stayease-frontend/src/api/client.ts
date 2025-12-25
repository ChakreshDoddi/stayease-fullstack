import axios from 'axios';
import type { ApiResponse } from '@/types/api';
import { authStore } from '@/auth/auth-store';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      authStore.notifyUnauthorized();
    }
    return Promise.reject(error);
  },
);

export const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data as T;
