import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('flavorsync_user')) || null,
  token: localStorage.getItem('flavorsync_token') || null,
  isAuthenticated: !!localStorage.getItem('flavorsync_token'),

  setAuth: (user, token) => {
    localStorage.setItem('flavorsync_user', JSON.stringify(user));
    localStorage.setItem('flavorsync_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('flavorsync_user');
    localStorage.removeItem('flavorsync_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('flavorsync_user', JSON.stringify(user));
    set({ user });
  }
}));
