// 📁 components/PerfilComprador/TopCompras.tsx

import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ProductoResumen {
  id: number;
  nombre: string;
  cantidad: number;
  total: number;
}

interface Props {
  productos: ProductoResumen[];
}

export default function TopCompras({ productos }: Props) {
  if (productos.length === 0) return null;

  const volverAComprar = async (productoId: number) => {
    try {
      const res = await fetch('/api/pedidos/rapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId }),
      });
      if (!res.ok) throw new Error();
      toast.success('🛒 Pedido creado exitosamente');
    } catch (err) {
      toast.error('❌ No se pudo crear el pedido');
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">🔥 Tus productos más comprados</h2>
      <ul className="divide-y divide-gray-200">
        {productos.map((item) => (
          <li key={item.id} className="py-2">
            <p className="font-medium">{item.nombre}</p>
            <p className="text-sm text-gray-700">Veces comprado: {item.cantidad}</p>
            <p className="text-sm text-gray-500">Total invertido: Q{item.total.toFixed(2)}</p>
            <div className="flex gap-3 mt-1">
              <Link
                href={`/productos/${item.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Ver producto
              </Link>
              <button
                onClick={() => volverAComprar(item.id)}
                className="text-sm text-green-600 hover:underline"
              >
                Volver a comprar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}