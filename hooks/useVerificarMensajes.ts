// 📁 hooks/useVerificarMensajes.ts

import { useCallback } from 'react';
import { useAuth } from './useAuth';

export const useVerificarMensajesNoLeidos = (
  actualizarEstado: (hayNoLeidos: boolean, cantidad: number) => void
) => {
  const { token } = useAuth();

  return useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mensajes/conversaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const mensajesNoLeidos = data.filter((conv: any) => conv.leido === false);
      actualizarEstado(mensajesNoLeidos.length > 0, mensajesNoLeidos.length);
    } catch (err) {
      console.error('❌ Error al verificar mensajes no leídos:', err);
    }
  }, [token, actualizarEstado]);
};
