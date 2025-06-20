import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../domain/user";
import { storageService } from "../services/storage";

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await storageService.getAuthToken();
        const storedUser = await storageService.getUser();

        if (token && storedUser) {
          setIsAuthenticated(true);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
      }
    };

    loadStorageData();
  }, []);

  const login = async (token: string, user: User) => {
    try {
      await storageService.setAuthToken(token);
      await storageService.setUser(user);
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageService.clearAuth();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
