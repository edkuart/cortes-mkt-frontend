// 📁 pages/mensajes/index.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Conversacion {
  id: number;
  participante: {
    id: number;
    nombreCompleto: string;
    fotoUrl?: string;
  };
  ultimoMensaje: string;
  fecha: string;
}

const BandejaMensajes = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);

  useEffect(() => {
    if (!user || !token) return;

    fetch('http://localhost:4000/api/mensajes/conversaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setConversaciones(data))
      .catch(() => console.error('Error al cargar conversaciones'));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📨 Mis conversaciones</h1>

      {conversaciones.length === 0 ? (
        <p className="text-gray-600">No tienes conversaciones iniciadas aún.</p>
      ) : (
        <ul className="space-y-4">
          {conversaciones.map(conv => (
            <li key={conv.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <Link href={`/mensajes/${conv.id}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={conv.participante.fotoUrl || '/placeholder.jpg'}
                    className="w-12 h-12 rounded-full object-cover border"
                    alt={conv.participante.nombreCompleto}
                  />
                  <div>
                    <p className="font-semibold">{conv.participante.nombreCompleto}</p>
                    <p className="text-sm text-gray-500">{conv.ultimoMensaje}</p>
                    <p className="text-xs text-gray-400">{new Date(conv.fecha).toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BandejaMensajes;