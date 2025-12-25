import { api, unwrap } from './client';
import type { JwtResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

export const login = async (payload: LoginRequest) => {
  const res = await api.post('/auth/login', payload);
  return unwrap<JwtResponse>(res);
};

export const registerUser = async (payload: RegisterRequest) => {
  const res = await api.post('/auth/register', payload);
  return unwrap<User>(res);
};

export const registerOwner = async (payload: RegisterRequest) => {
  const res = await api.post('/auth/register/owner', payload);
  return unwrap<User>(res);
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return unwrap<User>(res);
};
