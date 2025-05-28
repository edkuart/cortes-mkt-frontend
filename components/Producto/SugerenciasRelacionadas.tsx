// 📁 components/Producto/SugerenciasRelacionadas.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
}

interface Props {
  productoId: number;
}

const SugerenciasRelacionadas = ({ productoId }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchSugerencias = async () => {
      try {
        const res = await fetch(`/api/favoritos/sugerencias/${productoId}`);
        const sugerencias = await res.json();

        const detalles = await Promise.all(
          sugerencias.map(async (s: { productoId: number }) => {
            const p = await fetch(`/api/productos/${s.productoId}`);
            return await p.json();
          })
        );

        setProductos(detalles);
      } catch (error) {
        console.error('Error al cargar sugerencias', error);
      }
    };

    fetchSugerencias();
  }, [productoId]);

  if (!productos.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">🔎 También te pueden gustar...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productos.map((p) => (
          <Link key={p.id} href={`/productos/${p.id}`} className="border p-4 rounded shadow hover:bg-gray-50">
            <img src={`/${p.imagen}`} alt={p.nombre} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold text-sm truncate">{p.nombre}</h3>
            <p className="text-sm text-gray-600">Q{p.precio.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SugerenciasRelacionadas;