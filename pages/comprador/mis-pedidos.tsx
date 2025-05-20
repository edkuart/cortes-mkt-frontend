// 📁 pages/mis-pedidos.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface Pedido {
  id: number;
  createdAt: string;
  total: number;
  estadoTexto: string;
  mostrarBotonConfirmar: boolean;
  vendedorId: number;
  detalles: {
    producto: {
      nombre: string;
    };
    cantidad: number;
  }[];
}

interface Devolucion {
  id: number;
  motivo: string;
  estado: string;
  createdAt: string;
  pedidoId: number;
}

export default function MisPedidosPage() {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [motivos, setMotivos] = useState<Record<number, string>>({});
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!isAuthenticated() || !user) return;

      try {
        const res = await fetch(`http://localhost:4000/api/pedidos/usuario/${user.id}`);
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    const fetchDevoluciones = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/devoluciones/usuario/${user?.id}`);
        const data = await res.json();
        setDevoluciones(data);
      } catch (error) {
        console.error('Error al obtener devoluciones:', error);
      }
    };

    fetchPedidos();
    fetchDevoluciones();
  }, [user]);

  const confirmarEntrega = async (pedidoId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/entregas/${pedidoId}/confirmar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'cliente' }),
      });

      if (!res.ok) throw new Error('Error al confirmar entrega');

      const data = await res.json();
      console.log('✅ Confirmación exitosa:', data);

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estadoTexto: 'En camino', mostrarBotonConfirmar: false } : p
        )
      );
    } catch (error) {
      console.error('❌ Error al confirmar entrega:', error);
    }
  };

  const solicitarDevolucion = async (pedidoId: number) => {
    const motivo = motivos[pedidoId];
    if (!motivo) return toast.error('Debes ingresar un motivo');

    try {
      const res = await fetch('http://localhost:4000/api/devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, pedidoId })
      });

      if (!res.ok) throw new Error('Error al solicitar devolución');

      toast.success('Devolución solicitada correctamente');
      setMotivos((prev) => ({ ...prev, [pedidoId]: '' }));
      const nueva = await res.json();
      setDevoluciones(prev => [...prev, nueva]);

      // 📧 Notificación real por correo
      await fetch('http://localhost:4000/api/notificaciones/correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asunto: 'Nueva solicitud de devolución',
          contenido: `Se ha solicitado una devolución para el pedido ID ${pedidoId} con motivo: ${motivo}`
        })
      });
    } catch (err) {
      console.error(err);
      toast.error('Error al solicitar devolución');
    }
  };

  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">📦 Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No has realizado ningún pedido aún.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border rounded p-4">

              {pedido.estadoTexto === 'Entregado' && (
                <button
                  onClick={() =>
                    router.push(`/crear-resena?vendedorId=${pedido.vendedorId}&pedidoId=${pedido.id}`)
                  }
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Dejar reseña
                </button>
              )}

              {pedido.mostrarBotonConfirmar && (
                <button
                  onClick={() => confirmarEntrega(pedido.id)}
                  className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Confirmar recibido
                </button>
              )}

              <p className="text-sm text-gray-500 mb-1">Fecha: {new Date(pedido.createdAt).toLocaleString()}</p>

              <p className="inline-block px-2 py-1 text-sm rounded font-medium bg-blue-100 text-blue-700 mb-2">
                Estado: {pedido.estadoTexto}
              </p>

              <p className="font-semibold mb-2">Total estimado: Q{pedido.total}</p>

              <ul className="list-disc ml-5">
                {pedido.detalles.map((d, index) => (
                  <li key={index}>
                    {d.producto.nombre} x {d.cantidad}
                  </li>
                ))}
              </ul>

              <div className="mt-3">
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Motivo de la devolución"
                  value={motivos[pedido.id] || ''}
                  onChange={(e) => setMotivos(prev => ({ ...prev, [pedido.id]: e.target.value }))}
                />
                <button
                  onClick={() => solicitarDevolucion(pedido.id)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Solicitar devolución
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {devoluciones.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">📝 Mis devoluciones</h2>
          <ul className="space-y-3">
            {devoluciones.map((d) => (
              <li key={d.id} className="border p-3 rounded">
                <p className="text-sm text-gray-700">🧾 Motivo: {d.motivo}</p>
                <p className="text-sm text-gray-600">📌 Estado: <span className={
                  d.estado === 'pendiente' ? 'text-yellow-600' :
                  d.estado === 'aceptada' ? 'text-green-600' :
                  'text-red-600'
                }>{d.estado}</span></p>
                <p className="text-xs text-gray-500">Fecha: {new Date(d.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
