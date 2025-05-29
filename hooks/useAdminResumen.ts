// 📁 frontend/hooks/useAdminResumen.ts

import { useEffect, useState } from 'react';

interface AdminResumen {
  totalUsuarios: number;
  totalProductos: number;
  totalPedidos: number;
  totalResenas: number;
}

export const useAdminResumen = (token: string | null) => {
  const [resumen, setResumen] = useState<AdminResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchResumen = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/resumen', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener resumen del dashboard');
        }

        const data = await res.json();
        setResumen(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [token]);

  return { resumen, loading, error };
};
