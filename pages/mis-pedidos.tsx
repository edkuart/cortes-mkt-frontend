// 📁 pages/mis-pedidos.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Pedido {
  id: number;
  createdAt: string;
  total: number;
  estadoTexto: string;
  mostrarBotonConfirmar: boolean;
  detalles: {
    producto: {
      nombre: string;
    };
    cantidad: number;
  }[];
}

export default function MisPedidosPage() {
  const { usuario, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!isAuthenticated() || !usuario) return;

      try {
        const res = await fetch(`http://localhost:4000/api/pedidos/usuario/${usuario.id}`);
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    fetchPedidos();
  }, [usuario]);

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
  
      // Actualizar el estado local
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId
            ? { ...p, estadoTexto: 'En camino', mostrarBotonConfirmar: false }
            : p
        )
      );
    } catch (error) {
      console.error('❌ Error al confirmar entrega:', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No has realizado ningún pedido aún.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border rounded p-4">
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
          </li>
          
          ))}
        </ul>
      )}
    </div>
  );
}
