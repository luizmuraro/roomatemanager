import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const response = await apiClient.get<ApiResponse<User>>("/api/auth/me");
    setUser(response.data.data);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrapAuth();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<User>>("/api/auth/login", {
      email,
      password,
    });

    setUser(response.data.data);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await apiClient.post<ApiResponse<User>>("/api/auth/register", {
        name,
        email,
        password,
      });

      setUser(response.data.data);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
