// 📁 components/PerfilComprador/FavoritosComprador.tsx

import Link from 'next/link';

interface ProductoFavorito {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

const favoritosMock: ProductoFavorito[] = [
  { id: 301, nombre: 'Huipil bordado San Juan', precio: 280, categoria: 'huipil' },
  { id: 302, nombre: 'Corte ceremonial Sololá', precio: 180, categoria: 'corte' },
  { id: 303, nombre: 'Blusa típica estilo moderno', precio: 150, categoria: 'blusa' },
];

export default function FavoritosComprador() {
  if (favoritosMock.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">🧡 Tus productos favoritos</h2>
      <ul className="divide-y divide-gray-200">
        {favoritosMock.map((producto) => (
          <li key={producto.id} className="py-2">
            <p className="font-medium">{producto.nombre}</p>
            <p className="text-sm text-gray-600">Q{producto.precio.toFixed(2)} · {producto.categoria}</p>
            <Link href={`/productos/${producto.id}`} className="text-blue-600 hover:underline text-sm">
              Ver producto
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
