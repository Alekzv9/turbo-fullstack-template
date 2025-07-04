import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '~/api/types';

type User = {
  id: string;
  email: string;
  role: Role;
  name: string | null;
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  saveToken: (token: string, user: User) => Promise<void>;
  logout: () => void;
  isAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      saveToken: async (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      isAuth: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
