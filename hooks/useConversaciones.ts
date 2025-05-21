import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface Conversacion {
  id: number;
  nombre: string;
  ultimoMensaje: string;
  fecha: string;
  leido: boolean;
}

export const useConversaciones = () => {
  const { token } = useAuth();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversaciones = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mensajes/conversaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversaciones(data);
      } catch {
        console.error('Error al cargar conversaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchConversaciones();
  }, [token]);

  return { conversaciones, loading };
};