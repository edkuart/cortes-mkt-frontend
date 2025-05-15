// 🧩 pages/editar-resena.tsx 
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Estrellas from '@/components/Estrellas';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
}

export default function EditarResena() {
  const { usuario, isAuthenticated, token } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [resenaSeleccionada, setResenaSeleccionada] = useState<Resena | null>(null);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || !usuario) return;
    fetch(`http://localhost:4000/api/resenas/comprador/${usuario.id}`)
      .then(res => res.json())
      .then(setResenas)
      .catch(() => toast.error('Error al obtener reseñas'));
  }, [usuario]);

  const seleccionarResena = (r: Resena) => {
    setResenaSeleccionada(r);
    setComentario(r.comentario);
    setCalificacion(r.calificacion);
  };

  const guardarCambios = async () => {
    if (!resenaSeleccionada) return;
    const res = await fetch(`http://localhost:4000/api/resenas/${resenaSeleccionada.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentario, calificacion }),
    });

    if (res.ok) {
      toast.success('Reseña actualizada');
      router.reload();
    } else {
      toast.error('Error al actualizar reseña');
    }
  };

  const eliminarResena = async () => {
    if (!resenaSeleccionada) return;
    const confirmar = confirm('Estás seguro de eliminar esta reseña?');
    if (!confirmar) return;

    const res = await fetch(`http://localhost:4000/api/resenas/${resenaSeleccionada.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success('Reseña eliminada');
      setResenaSeleccionada(null);
      router.reload();
    } else {
      toast.error('No se puede eliminar una reseña ya respondida');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Editar o eliminar reseñas</h1>

      {!resenaSeleccionada ? (
        <ul className="space-y-3">
          {resenas.map(r => (
            <li
              key={r.id}
              onClick={() => seleccionarResena(r)}
              className="p-3 border rounded cursor-pointer hover:bg-gray-100"
            >
              <p>⭐ {r.calificacion} - "{r.comentario.slice(0, 50)}..."</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-4">
          <Estrellas calificacion={calificacion} editable={true} setCalificacion={setCalificacion} />
          <textarea
            className="w-full border rounded p-2"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={guardarCambios}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar cambios
            </button>
            <button
              onClick={eliminarResena}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Eliminar reseña
            </button>
            <button
              onClick={() => setResenaSeleccionada(null)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
