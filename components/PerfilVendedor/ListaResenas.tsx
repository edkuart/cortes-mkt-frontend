// 📁 components/PerfilVendedor/ListaResenas.tsx

import dayjs from 'dayjs';
import { useState } from 'react';

interface Props {
  resenas: {
    id: number;
    comentario: string;
    calificacion: number;
    createdAt: string;
    Comprador?: { nombreCompleto: string };
  }[];
  paginaActual: number;
  cambiarPagina: (nueva: number) => void;
  totalPaginas: number;
}

export default function ListaResenas({ resenas, paginaActual, cambiarPagina, totalPaginas }: Props) {
  const [verMasId, setVerMasId] = useState<number | null>(null);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Reseñas del vendedor</h3>
      <ul className="space-y-3">
        {resenas.map((r) => (
          <li key={r.id} className="border-b pb-2">
            <p className="text-sm text-gray-700">
              ⭐ {r.calificacion} - "
              {r.comentario.length > 200 && verMasId !== r.id
                ? `${r.comentario.slice(0, 200)}... `
                : r.comentario}
              {r.comentario.length > 200 && (
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => setVerMasId(verMasId === r.id ? null : r.id)}
                >
                  {verMasId === r.id ? 'ver menos' : 'ver más'}
                </button>
              )}
              "
            </p>
            <p className="text-xs text-gray-500">
              {r.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(r.createdAt).format('D [de] MMMM [de] YYYY')}
            </p>
          </li>
        ))}
      </ul>

      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>
          <span className="px-4 py-1 text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}