// 📁 page/resenas-producto/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Estrellas from '@/components/Estrellas';
import ResponderResenaBox from '@/components/ResponderResenaBox';
import toast, { Toaster } from 'react-hot-toast';
import palabrasProhibidas from '@/utils/palabrasProhibidas';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  Usuario?: {
    nombreCompleto: string;
  };
  respuestaVendedor?: string;
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

  useEffect(() => {
    if (!id) return;

    const fetchResenas = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/resenas/producto/${id}`);
        if (!res.ok) throw new Error('Error al obtener reseñas');
        const data = await res.json();
        setResenas(data);
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
                <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded text-sm text-blue-900 shadow-sm">
                  <strong className="block mb-1">Respuesta del vendedor:</strong>
                  <p className="whitespace-pre-line leading-relaxed">{r.respuestaVendedor}</p>
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

