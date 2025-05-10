import { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    usuario: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      setAuth({
        token,
        usuario: JSON.parse(usuario),
      });
    }
  }, []);

  const login = (usuario: Usuario, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setAuth({ usuario, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setAuth({ usuario: null, token: null });
  };

  const isAuthenticated = () => !!auth.token;

  return { ...auth, login, logout, isAuthenticated };
};
