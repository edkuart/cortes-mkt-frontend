// 📁 components/RutaProtegida.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

interface Props {
  children: React.ReactNode;
  rolesPermitidos?: string[]; // ej: ['admin', 'vendedor']
  redireccion?: string;       // por defecto '/'
}

const RutaProtegida = ({ children, rolesPermitidos = [], redireccion = '/' }: Props) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated() ||
        !user ||
        (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.rol)))
    ) {
      router.push(redireccion);
    }
  }, [loading, user]);

  if (
    loading ||
    !isAuthenticated() ||
    !user ||
    (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.rol))
  ) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return <>{children}</>;
};

export default RutaProtegida;