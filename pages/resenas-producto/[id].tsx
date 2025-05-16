// 📄 pages/resenas-producto/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Estrellas from '@/components/Estrellas';
import ResponderResenaBox from '@/components/ResponderResenaBox';
import toast, { Toaster } from 'react-hot-toast';
import palabrasProhibidas from '@/utils/palabrasProhibidas.json';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  vendedorId: number;
  Usuario?: {
    nombreCompleto: string;
    id: number;
  };
  respuestaVendedor?: string;
}

interface Ranking {
  promedioCalificacion: number;
  ventasTotales: number;
  montoTotal: number;
}

function contieneInsultos(texto: string): boolean {
  const textoNormalizado = texto.toLowerCase();
  return palabrasProhibidas.some(palabra => textoNormalizado.includes(palabra));
}

async function enviarRespuestaModerada(resenaId: number, nueva: string): Promise<boolean> {
  if (contieneInsultos(nueva)) {
    toast.error('La respuesta contiene lenguaje ofensivo. Por favor, revisala.');
    return false;
  }

  try {
    const res = await fetch(`http://localhost:4000/api/resenas/${resenaId}/respuesta`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuestaVendedor: nueva })
    });

    if (!res.ok) throw new Error();
    toast.success('Respuesta guardada exitosamente');
    return true;
  } catch {
    toast.error('Error al guardar la respuesta');
    return false;
  }
}

export default function ResenasPorProducto() {
  const router = useRouter();
  const { id } = router.query;
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [ranking, setRanking] = useState<Ranking | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResenas = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/resenas/producto/${id}`);
        if (!res.ok) throw new Error('Error al obtener reseñas');
        const data = await res.json();
        setResenas(data);

        if (data.length > 0) {
          const vendedorId = data[0].vendedorId;
          const rankingRes = await fetch(`http://localhost:4000/api/vendedores/${vendedorId}/ranking`);
          if (rankingRes.ok) {
            const rankingData = await rankingRes.json();
            setRanking(rankingData);
          }
        }
      } catch (error) {
        toast.error('No se pudieron cargar las reseñas');
        console.error(error);
      }
    };

    fetchResenas();
  }, [id]);

  const actualizarRespuesta = async (resenaId: number, nueva: string) => {
    const fueExitosa = await enviarRespuestaModerada(resenaId, nueva);
    if (fueExitosa) {
      setResenas(prev => prev.map(r => r.id === resenaId ? { ...r, respuestaVendedor: nueva } : r));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">🗣 Reseñas del Producto</h1>

      {ranking && (
        <div className="mb-4 p-4 border rounded bg-white shadow text-sm text-gray-700">
          <p><strong>⭐ Calificación del vendedor:</strong> {ranking.promedioCalificacion.toFixed(2)} / 5</p>
          <p><strong>🛍️ Ventas:</strong> {ranking.ventasTotales}</p>
          <p><strong>💰 Monto total:</strong> Q{ranking.montoTotal.toFixed(2)}</p>

          {ranking.promedioCalificacion >= 4.5 && (
            <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full shadow-sm">
              🏅 Vendedor Muy Valorad@
            </div>
          )}

          {ranking.ventasTotales >= 100 && (
            <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full shadow-sm">
              🥇 Top en Ventas
            </div>
          )}

          {ranking.montoTotal >= 10000 && (
            <div className="mt-2 inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full shadow-sm">
              💼 Vendedor Élite
            </div>
          )}
        </div>
      )}

      {resenas.length === 0 ? (
        <p className="text-gray-600">Este producto aún no tiene reseñas.</p>
      ) : (
        <ul className="space-y-4">
          {resenas.map((r) => (
            <li key={r.id} className="border rounded p-4 shadow">
              <Estrellas calificacion={r.calificacion} />
              <p className="mt-2 italic">"{r.comentario}"</p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(r.createdAt).toLocaleString()}
              </p>
              {r.Usuario?.nombreCompleto && (
                <p className="text-sm text-gray-700">Cliente: {r.Usuario.nombreCompleto}</p>
              )}
              {r.respuestaVendedor ? (
                <div className="mt-4 flex gap-3 items-start bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                  <div className="flex-shrink-0 text-blue-600 text-xl">
                    💬
                  </div>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Respuesta del vendedor</p>
                    <p className="whitespace-pre-line leading-relaxed">{r.respuestaVendedor}</p>
                  </div>
                </div>
              ) : (
                <ResponderResenaBox
                  resenaId={r.id}
                  onGuardado={(texto) => actualizarRespuesta(r.id, texto)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
