// 📁 page/resenas-producto/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Estrellas from '@/components/Estrellas';
import toast, { Toaster } from 'react-hot-toast';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  Usuario?: {
    nombreCompleto: string;
  };
}

export default function ResenasPorProducto() {
  const router = useRouter();
  const { id } = router.query;
  const [resenas, setResenas] = useState<Resena[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchResenas = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/resenas/producto/${id}`);
        if (!res.ok) throw new Error('Error al obtener reseñas');
        const data = await res.json();
        setResenas(data);
      } catch (error) {
        toast.error('No se pudieron cargar las reseñas');
        console.error(error);
      }
    };

    fetchResenas();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">🗣 Reseñas del Producto</h1>

      {resenas.length === 0 ? (
        <p className="text-gray-600">Este producto aún no tiene reseñas.</p>
      ) : (
        <ul className="space-y-4">
          {resenas.map((r) => (
            <li key={r.id} className="border rounded p-4 shadow">
              <Estrellas calificacion={r.calificacion} />
              <p className="mt-2 italic">"{r.comentario}"</p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(r.createdAt).toLocaleString()}
              </p>
              {r.Usuario?.nombreCompleto && (
                <p className="text-sm text-gray-700">Cliente: {r.Usuario.nombreCompleto}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
