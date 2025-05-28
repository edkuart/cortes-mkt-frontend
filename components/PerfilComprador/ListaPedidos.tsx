//📁 components/PerfilComprador/ListaPedidos.tsx

import Link from 'next/link';
import dayjs from 'dayjs';

interface Pedido {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
  detalles?: {
    producto: {
      id: number;
      nombre: string;
    };
    cantidad: number;
  }[];
}

interface Props {
  pedidos: Pedido[];
  totalGastado: number;
  ultimoPedido: Pedido | null;
  hayPedidoPendiente: boolean;
}

export default function ListaPedidos({ pedidos, totalGastado, ultimoPedido, hayPedidoPendiente }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">
        📦 Mis Pedidos <span className="text-sm text-gray-500">({pedidos.length})</span>
      </h2>
      <p className="text-sm text-gray-600 mb-2">📟 Total gastado: Q{totalGastado.toFixed(2)}</p>
      {hayPedidoPendiente && (
        <p className="text-sm text-yellow-600 mb-2">⚠️ Tienes pedidos pendientes por completar.</p>
      )}
      {ultimoPedido && (
        <p className="text-sm text-gray-700 mb-4">
          🕒 Último pedido: {dayjs(ultimoPedido.createdAt).format('DD/MM/YYYY HH:mm')} - Estado:{' '}
          <span className="font-semibold">{ultimoPedido.estado}</span>
        </p>
      )}
      {pedidos.length === 0 ? (
        <p className="text-gray-500">No has realizado pedidos aún.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {pedidos.map((p) => (
            <li key={p.id} className="py-2">
              <p className="font-medium">Pedido #{p.id} - Q{p.total.toFixed(2)}</p>
              <p className="text-sm">
                Estado:{' '}
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    p.estado === 'pendiente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : p.estado === 'completado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {p.estado}
                </span>
              </p>
              <p className="text-xs text-gray-400 mb-1">{dayjs(p.createdAt).format('DD/MM/YYYY HH:mm')}</p>
              {p.detalles && p.detalles.length > 0 && (
                <ul className="pl-4 list-disc text-sm text-gray-700">
                  {p.detalles.map((d, idx) => (
                    <li key={idx}>
                      <Link href={`/resenas-producto/${d.producto.id}`} className="text-blue-600 hover:underline">
                        {d.producto.nombre}
                      </Link>{' '}
                      - Cantidad: {d.cantidad}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}