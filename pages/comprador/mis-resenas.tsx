// 🧩 frontend/pages/mis-resenas.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  pedidoId: number;
}

export default function MisResenas() {
  const { user, token } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);

  const cargarResenas = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/resenas/comprador/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("👉 Resenas recibidas:", data);
      setResenas(data);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      toast.error("No se pudieron cargar tus reseñas");
    }
  };

  const eliminarResena = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de eliminar esta reseña?");
    if (!confirmar) return;

    const res = await fetch(`http://localhost:4000/api/resenas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.success("Reseña eliminada");
      setResenas(prev => prev.filter(r => r.id !== id));
    } else {
      toast.error("Error al eliminar reseña");
    }
  };

  const editarResena = async (id: number) => {
    const nuevaCalificacion = parseInt(prompt("Nueva calificación (1-5):") || '');
    const nuevoComentario = prompt("Nuevo comentario:");
    if (!nuevaCalificacion || !nuevoComentario) return;

    const res = await fetch(`http://localhost:4000/api/resenas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ calificacion: nuevaCalificacion, comentario: nuevoComentario }),
    });

    if (res.ok) {
      toast.success("Reseña actualizada");
      cargarResenas();
    } else {
      toast.error("No se pudo actualizar la reseña (¿pasaron 24h?)");
    }
  };

  useEffect(() => {
    if (user?.id) cargarResenas();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Mis Reseñas</h1>
      {resenas.length === 0 ? (
        <p className="text-gray-600">No has escrito ninguna reseña todavía.</p>
      ) : (
        <ul className="space-y-4">
          {resenas.map(r => (
            <li key={r.id} className="border p-4 rounded shadow-sm">
              <p className="text-yellow-600 font-medium">⭐ {r.calificacion}</p>
              <p className="text-gray-700 italic">"{r.comentario}"</p>
              <p className="text-xs text-gray-500">{dayjs(r.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => editarResena(r.id)} className="text-sm text-blue-600 hover:underline">Editar</button>
                <button onClick={() => eliminarResena(r.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

