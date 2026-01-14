import api from './api';
import type { AuthResponse } from '../types';

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

interface LoginData {
  email: string;
  motDePasse: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<{ message: string }> => {
    const response = await api.post('/utilisateurs/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/utilisateurs/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/utilisateurs/profile');
    return response.data;
  },
};