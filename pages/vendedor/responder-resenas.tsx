// 📄 pages/responder-resenas.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  compradorId: number;
  respuestaVendedor?: string;
  Comprador?: {
    nombreCompleto: string;
  };
}

export default function ResponderResenas() {
  const { user, isAuthenticated, token } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !user) return;
    fetch(`http://localhost:4000/api/resenas/vendedor/${user.id}`)
      .then(res => res.json())
      .then(setResenas)
      .catch(() => toast.error('Error al obtener reseñas'))
      .finally(() => setLoading(false));
  }, [user]);

  const responder = async (resenaId: number, respuesta: string) => {
    const res = await fetch(`http://localhost:4000/api/resenas/${resenaId}/respuesta`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ respuestaVendedor: respuesta }),
    });

    if (res.ok) {
      toast.success('Respuesta enviada');
      setResenas(prev =>
        prev.map(r =>
          r.id === resenaId ? { ...r, respuestaVendedor: respuesta } : r
        )
      );
    } else {
      toast.error('Error al enviar respuesta');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Responder reseñas de compradores</h1>

      {loading ? (
        <p className="text-gray-500">Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p className="text-gray-600">No hay reseñas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {resenas.map(resena => (
            <li key={resena.id} className="border p-4 rounded bg-white shadow">
              <p className="text-yellow-600 font-semibold">⭐ {resena.calificacion}</p>
              <p className="text-gray-700 italic mb-1">"{resena.comentario}"</p>
              <p className="text-sm text-gray-500">{resena.Comprador?.nombreCompleto || 'Cliente anónimo'}</p>

              {resena.respuestaVendedor ? (
                <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-700">
                  <strong>Tu respuesta:</strong> {resena.respuestaVendedor}
                </div>
              ) : (
                <form
                  className="mt-2 flex gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const respuesta = (form.elements.namedItem('respuesta') as HTMLInputElement).value;
                    responder(resena.id, respuesta);
                    form.reset();
                  }}
                >
                  <input
                    type="text"
                    name="respuesta"
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Responder
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}