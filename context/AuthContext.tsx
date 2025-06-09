// 📁 context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  fotoPerfil?: string;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log("✅ Usuario cargado desde localStorage:", storedUser);
      } catch (e) {
        console.error("❌ Error al parsear usuario:", e);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: Usuario, tokenData: string) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
