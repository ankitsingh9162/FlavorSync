import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('piggy_user')) || null,
  token: localStorage.getItem('piggy_token') || null,
  isAuthenticated: !!localStorage.getItem('piggy_token'),

  setAuth: (user, token) => {
    localStorage.setItem('piggy_user', JSON.stringify(user));
    localStorage.setItem('piggy_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('piggy_user');
    localStorage.removeItem('piggy_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('piggy_user', JSON.stringify(user));
    set({ user });
  }
}));
