// 📁 pages/mensajes/[id].tsx

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Mensaje {
  id: number;
  emisorId: number;
  receptorId: number;
  contenido: string;
  createdAt: string;
}

export default function ChatConVendedor() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { id: vendedorId } = router.query;
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !vendedorId) return;

    fetch(`http://localhost:4000/api/mensajes/${vendedorId}?usuarioId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setMensajes)
      .catch(() => toast.error('Error al cargar mensajes'));
  }, [vendedorId, user]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !user || !vendedorId) return;

    const res = await fetch('http://localhost:4000/api/mensajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        emisorId: user.id,
        receptorId: vendedorId,
        contenido: nuevoMensaje,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMensajes((prev) => [...prev, data]);
      setNuevoMensaje('');
      mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast.error('Error al enviar mensaje');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">💬 Conversación con el vendedor #{vendedorId}</h1>

      <div className="bg-white shadow rounded p-4 mb-4 max-h-[60vh] overflow-y-auto">
        {mensajes.map(m => (
          <div
            key={m.id}
            className={`mb-2 p-2 rounded-md w-fit max-w-xs text-sm ${
              m.emisorId === user?.id ? 'bg-green-100 ml-auto' : 'bg-gray-200'
            }`}
          >
            <p>{m.contenido}</p>
            <span className="block text-[10px] text-gray-500 mt-1 text-right">
              {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
        <div ref={mensajesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="flex gap-2">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}