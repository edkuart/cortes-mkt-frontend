// 📁 pages/crearResenaPage.tsx

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export default function CrearResenaPage() {
  const router = useRouter();
  const { vendedorId, pedidoId } = router.query;
  const { token } = useAuth();

  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [enviando, setEnviando] = useState(false);

  const enviarResena = async () => {
    if (!comentario.trim()) return toast.error('El comentario es obligatorio');
    if (!vendedorId || !pedidoId) return toast.error('Faltan datos del pedido o vendedor');

    setEnviando(true);
    try {
      const res = await fetch('http://localhost:4000/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendedorId: parseInt(vendedorId as string),
          pedidoId: parseInt(pedidoId as string),
          comentario,
          calificacion,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      toast.success('Reseña enviada con éxito');
      router.push('/mis-pedidos');
    } catch (err) {
      toast.error('Error al enviar la reseña');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">✍️ Dejar Reseña</h1>

      <label className="block mb-2 font-medium">Calificación (1 a 5)</label>
      <input
        type="number"
        min={1}
        max={5}
        value={calificacion}
        onChange={(e) => setCalificacion(Number(e.target.value))}
        className="border p-2 w-full rounded mb-4"
      />

      <label className="block mb-2 font-medium">Comentario</label>
      <textarea
        className="border p-2 w-full h-32 rounded mb-4"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button
        onClick={enviarResena}
        disabled={enviando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {enviando ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </div>
  );
}





