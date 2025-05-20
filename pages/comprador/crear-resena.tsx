// 📄 pages/crear-resena.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import Estrellas from '@/components/Estrellas';

const CrearResena = () => {
  const { user, token } = useAuth();
  const [pedidoId, setPedidoId] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [puedeResenar, setPuedeResenar] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user&& pedidoId) {
      setVerificando(true);
      fetch(`http://localhost:4000/api/resenas/verificar/${user.id}/${pedidoId}`)
        .then(res => res.json())
        .then(data => setPuedeResenar(!data.yaExiste))
        .catch(() => toast.error('Error al verificar reseña'))
        .finally(() => setVerificando(false));
    }
  }, [pedidoId]);

  const enviarResena = async () => {
    if (!pedidoId || !comentario || calificacion < 1 || calificacion > 5) {
      return toast.error('Completa todos los campos correctamente');
    }

    try {
      const res = await fetch('http://localhost:4000/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pedidoId,
          vendedorId: 1, // temporal hasta automatizar
          comentario,
          calificacion
        })
      });

      if (res.ok) {
        toast.success('Reseña enviada');
        router.push('/mis-resenas');
      } else {
        const data = await res.json();
        toast.error(data.mensaje || 'Error al enviar reseña');
      }
    } catch (err) {
      toast.error('Error del servidor');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">📝 Crear Reseña</h1>

      <label className="block mb-2">
        ID del pedido:
        <input
          type="text"
          value={pedidoId}
          onChange={e => setPedidoId(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </label>

      {verificando && <p className="text-sm text-gray-500">Verificando posibilidad de reseñar...</p>}
      {!verificando && !puedeResenar && pedidoId && (
        <p className="text-red-500 text-sm">⚠ Ya dejaste una reseña para este pedido.</p>
      )}

      {puedeResenar && (
        <>
          <label className="block mb-2">
            Comentario:
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              className="border p-2 w-full rounded"
              rows={3}
            />
          </label>

          <label className="block mb-4">
            Calificación:
            <Estrellas calificacion={calificacion} onChange={setCalificacion} editable />
          </label>

          <button
            onClick={enviarResena}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar reseña
          </button>
        </>
      )}
    </div>
  );
};

export default CrearResena;








