// 📁 pages/misResenasPage.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  Vendedor?: {
    nombreCompleto: string;
  };
}

export default function MisResenasPage() {
  const { usuario, token, isAuthenticated } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);

  useEffect(() => {
    const fetchResenas = async () => {
      if (!isAuthenticated() || !usuario) return;
      try {
        const res = await fetch(`http://localhost:4000/api/resenas/comprador/${usuario.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!res.ok) throw new Error('Error al cargar resenas');
        const data = await res.json();
        setResenas(data);
      } catch (error) {
        toast.error('No se pudieron cargar tus resenas');
        console.error(error);
      }
    };
    fetchResenas();
  }, [usuario, isAuthenticated, token]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">📝 Mis Reseñas</h1>

      {resenas.length === 0 ? (
        <p className="text-gray-600">No has dejado ninguna reseña todavía.</p>
      ) : (
        <ul className="space-y-4">
          {resenas.map((r) => (
            <li key={r.id} className="border p-4 rounded shadow">
              <p className="text-sm text-gray-500">Fecha: {new Date(r.createdAt).toLocaleString()}</p>
              <p className="text-lg font-semibold mb-1">⭐ Calificación: {r.calificacion}/5</p>
              <p className="mb-2">"{r.comentario}"</p>
              {r.Vendedor?.nombreCompleto && (
                <p className="text-sm text-gray-700">Vendedor: {r.Vendedor.nombreCompleto}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



