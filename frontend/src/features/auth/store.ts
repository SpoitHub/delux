import { create } from 'zustand';
import { apiGetMe, apiLogout, apiRefreshToken, apiUpdateProfile } from '../../shared/api/auth';
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
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (access, refresh, user) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (token && refresh) {
      try { await apiLogout(refresh, token); } catch { /* ignore */ }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mock_user'); // clean up legacy key
    useCartStore.getState().setItemsCount(0);
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await apiGetMe(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      // Token might be expired — try refresh
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { access } = await apiRefreshToken(refresh);
          localStorage.setItem('access_token', access);
          const user = await apiGetMe(access);
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        } catch { /* fall through */ }
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const updated = await apiUpdateProfile(data, token);
    const { user } = get();
    if (!user) return;
    const newUser: AuthUser = { ...user, ...updated };
    set({ user: newUser });
  },
}));
