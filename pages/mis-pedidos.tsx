import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Pedido {
  id: number;
  createdAt: string;
  total: number;
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No has realizado ningún pedido aún.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border rounded p-4">
              <p className="text-sm text-gray-500 mb-2">Fecha: {new Date(pedido.createdAt).toLocaleString()}</p>
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
