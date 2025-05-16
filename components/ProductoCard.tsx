// 🧩 components/ProductoCard.tsx

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Estrellas from './Estrellas';
import InsigniasVendedor from './InsigniasVendedor';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  Usuario?: {
    nombreCompleto: string;
  };
}

interface ProductoCardProps {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  onEditar?: (id: number) => void;
  onEliminar?: (id: number) => void;
  destacado?: boolean;
  filtroTipo?: string;
  vendedorId?: number;
}

const filtrarResenas = (resenas: Resena[], filtroTipo: string): Resena[] => {
  const tieneComentario = (r: Resena) => r.comentario && r.comentario.trim() !== '';

  const cumpleFiltro = (r: Resena) => {
    if (filtroTipo === 'positivas') return r.calificacion >= 4;
    if (filtroTipo === 'regulares') return r.calificacion === 3;
    if (filtroTipo === 'negativas') return r.calificacion <= 2;
    return true;
  };

  return resenas.filter(r => tieneComentario(r) && cumpleFiltro(r));
};

const api = {
  async fetchPromedioYCantidad(productoId: number): Promise<{ promedio: number | null; cantidad: number }> {
    try {
      const res = await fetch(`http://localhost:4000/api/productos/${productoId}/promedio-calificacion`);
      const data = await res.json();
      return {
        promedio: parseFloat(data.promedio),
        cantidad: data.cantidad,
      };
    } catch {
      return { promedio: null, cantidad: 0 };
    }
  },

  async fetchUltimasResenas(productoId: number): Promise<Resena[]> {
    try {
      const res = await fetch(`http://localhost:4000/api/resenas/producto/${productoId}/ultimas`);
      return await res.json();
    } catch {
      return [];
    }
  }
};

export const useResenasProducto = (productoId: number, filtroTipo: string) => {
  const [promedio, setPromedio] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [ultimasResenas, setUltimasResenas] = useState<Resena[]>([]);

  const fetchDatos = () => {
    api.fetchPromedioYCantidad(productoId).then(({ promedio, cantidad }) => {
      setPromedio(promedio);
      setCantidad(cantidad);
    });

    api.fetchUltimasResenas(productoId).then(setUltimasResenas);
  };

  useEffect(() => {
    fetchDatos();
  }, [productoId]);

  const ultimasFiltradas = filtrarResenas(ultimasResenas, filtroTipo);

  return {
    promedio,
    cantidad,
    ultimasFiltradas,
    refetch: fetchDatos
  };
};

const ProductoCard: React.FC<ProductoCardProps> = ({
  id,
  nombre,
  precio,
  imagen,
  onEditar,
  onEliminar,
  destacado = false,
  filtroTipo = 'todas',
  vendedorId,
}) => {
  const { promedio, cantidad, ultimasFiltradas, refetch } = useResenasProducto(id, filtroTipo);
  
  return (
    <div className={`border rounded shadow p-4 relative ${destacado ? 'bg-yellow-50 border-yellow-400' : 'bg-white'}`}>
      {imagen && (
        <Image
          src={`http://localhost:4000/${imagen.replace(/\\/g, '/')}`}
          alt={nombre}
          width={300}
          height={200}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}

      <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
        {nombre}
        {destacado && <span className="text-sm bg-yellow-300 text-yellow-800 px-2 py-0.5 rounded">🌟 Top</span>}
      </h2>
      <p className="text-green-600 font-bold mb-1">Q{precio.toFixed(2)}</p>

      {promedio !== null && cantidad > 0 ? (
        <div className="mb-2">
          <Estrellas calificacion={promedio} />
          <p className="text-sm text-gray-500">{cantidad} reseña{cantidad !== 1 ? 's' : ''}</p>
          <Link href={`/resenas-producto/${id}`} className="text-blue-500 text-sm hover:underline">
            Ver todas
          </Link>
          {ultimasFiltradas.length > 0 && (
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-700 space-y-2">
              <InsigniasVendedor vendedorId={vendedorId} />
              {ultimasFiltradas.map((r) => (
                <div key={r.id}>
                  <p className="font-medium text-yellow-700">⭐ {r.calificacion} - {r.Usuario?.nombreCompleto || 'Cliente'}</p>
                  <p className="italic text-gray-600">"{r.comentario.slice(0, 60)}..."</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Sin reseñas aún</p>
      )}

      {(onEditar || onEliminar) && (
        <div className="mt-3 flex justify-end gap-2">
          {onEditar && (
            <button
              onClick={() => onEditar(id)}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Editar
            </button>
          )}
          {onEliminar && (
            <button
              onClick={() => onEliminar(id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductoCard;


