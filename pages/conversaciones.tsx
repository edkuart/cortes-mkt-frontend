// 📁 pages/conversaciones.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMensajesContext } from '@/context/MensajesContext';
import { useVerificarMensajesNoLeidos } from '@/hooks/useVerificarMensajes';
import ConversacionCard from '@/components/ConversacionCard';

interface Conversacion {
  id: number;
  nombre: string;
  ultimoMensaje: string;
  fecha: string;
  leido: boolean;
  rol?: string;
  ultimoLogin?: string;
}

export default function Conversaciones() {
  const { user, token } = useAuth();
  const { setHayNoLeidos } = useMensajesContext();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cantidadNoLeidos, setCantidadNoLeidos] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [soloNoLeidos, setSoloNoLeidos] = useState(false);
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const verificarMensajesNoLeidos = useVerificarMensajesNoLeidos((estado, cantidad) => {
    setHayNoLeidos(estado);
    setCantidadNoLeidos(cantidad);
  });

  const obtenerConversaciones = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mensajes/conversaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversaciones(data);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
    }
  };

  useEffect(() => {
    obtenerConversaciones();
    verificarMensajesNoLeidos();
  }, [token, verificarMensajesNoLeidos]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      obtenerConversaciones();
      verificarMensajesNoLeidos();
    }, 60000); // cada 60s
    return () => clearInterval(intervalo);
  }, [token, verificarMensajesNoLeidos]);

  const conversacionesFiltradas = conversaciones
    .filter((c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (!soloNoLeidos || !c.leido)
    )
    .sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📨 Conversaciones</h1>

      <details open={mostrarFiltros} className="mb-4">
        <summary
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="cursor-pointer text-sm text-blue-600 mb-2"
        >
          Filtros avanzados
        </summary>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:max-w-xs"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center text-sm gap-1">
              <input
                type="checkbox"
                checked={soloNoLeidos}
                onChange={() => setSoloNoLeidos((prev) => !prev)}
              />
              Solo no leídos
            </label>

            <button
              onClick={() => setOrdenAscendente((prev) => !prev)}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Orden: {ordenAscendente ? 'Antiguos ↑' : 'Recientes ↓'}
            </button>
          </div>
        </div>
      </details>

      {conversacionesFiltradas.length === 0 ? (
        <p className="text-gray-600">No hay conversaciones que coincidan.</p>
      ) : (
        <ul className="space-y-4">
          {conversacionesFiltradas.map((conv) => (
            <ConversacionCard key={conv.id} {...conv} />
          ))}
        </ul>
      )}
    </div>
  );
}