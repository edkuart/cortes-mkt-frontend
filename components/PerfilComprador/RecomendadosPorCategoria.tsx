// 📁 components/PerfilComprador/RecomendadosPorCategoria.tsx

import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface Props {
  categoria: string | null;
}

const productosMock: Producto[] = [
  { id: 101, nombre: 'Corte Maya Azul', precio: 150, categoria: 'corte' },
  { id: 102, nombre: 'Blusa Tradicional', precio: 200, categoria: 'corte' },
  { id: 103, nombre: 'Faja Bordada', precio: 75, categoria: 'corte' },
  { id: 104, nombre: 'Camisa Formal', precio: 190, categoria: 'urbano' },
  { id: 105, nombre: 'Vestido Casual', precio: 220, categoria: 'urbano' },
];

export default function RecomendadosPorCategoria({ categoria }: Props) {
  if (!categoria) return null;

  const recomendados = productosMock.filter((p) => p.categoria === categoria).slice(0, 3);

  if (recomendados.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">🎯 Recomendado para ti</h2>
      <p className="text-sm text-gray-500 mb-2">Basado en tu historial de compras en <span className="font-semibold">{categoria}</span></p>
      <ul className="divide-y divide-gray-200">
        {recomendados.map((producto) => (
          <li key={producto.id} className="py-2">
            <p className="font-medium">{producto.nombre}</p>
            <p className="text-sm text-gray-700">Precio: Q{producto.precio.toFixed(2)}</p>
            <Link href={`/productos/${producto.id}`} className="text-blue-600 hover:underline text-sm">
              Ver producto
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}