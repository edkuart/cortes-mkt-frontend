// 📁 context/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  nombre?: string;
  correo?: string;
  rol?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: Usuario | null;
  token: string;
  login: (user: Usuario, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string>('');

  const login = (userData: Usuario, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
