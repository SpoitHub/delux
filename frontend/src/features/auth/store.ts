import { create } from 'zustand';
import { mockUpdateProfile } from '../../shared/api/mock-data';
import { useCartStore } from '../cart/store';

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_organizer: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string, user: AuthUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string }) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (access, refresh, user) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('mock_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mock_user');
    // Сбросить бадж корзины для нового пользователя
    useCartStore.getState().setItemsCount(0);
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) { set({ isLoading: false }); return; }
      const stored = localStorage.getItem('mock_user');
      const user: AuthUser | null = stored ? JSON.parse(stored) : null;
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: (data) => {
    const { user } = get();
    if (!user) return;
    const updated = mockUpdateProfile(user.id, data);
    const newUser: AuthUser = { ...user, ...updated };
    localStorage.setItem('mock_user', JSON.stringify(newUser));
    set({ user: newUser });
  },
}));
