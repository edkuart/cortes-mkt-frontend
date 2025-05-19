// 📁 hooks/useAuth.ts

import { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
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
      try {
        const parsedUser = JSON.parse(usuario);
        console.log("✅ Usuario recuperado de localStorage:", parsedUser);
        setAuth({
          token,
          usuario: parsedUser,
        });
      } catch (e) {
        console.error("❌ Error al parsear usuario desde localStorage:", e);
      }
    } else {
      console.warn("⚠️ No hay token o usuario en localStorage.");
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

  return {
    user: auth.usuario,       // 🔁 Esto evita conflictos y errores en los componentes
    token: auth.token,
    login,
    logout,
    isAuthenticated
  };  
};
