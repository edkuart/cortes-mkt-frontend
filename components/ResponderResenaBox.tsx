// 🗨️ components/ResponderResenaBox.tsx

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  resenaId: number;
  onGuardado: (texto: string) => void;
}

const LIMITE_CARACTERES = 280;

export default function ResponderResenaBox({ resenaId, onGuardado }: Props) {
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const caracteresUsados = respuesta.length;
  const sePasoDelLimite = caracteresUsados > LIMITE_CARACTERES;

  const guardarRespuesta = async () => {
    if (!respuesta.trim()) {
      return toast.error('La respuesta no puede estar vacía');
    }

    if (sePasoDelLimite) {
      return toast.error(`Máximo permitido: ${LIMITE_CARACTERES} caracteres`);
    }

    setCargando(true);
    try {
      const res = await fetch(`http://localhost:4000/api/resenas/${resenaId}/respuesta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestaVendedor: respuesta })
      });

      if (!res.ok) throw new Error('Error al guardar la respuesta');

      onGuardado(respuesta);
      toast.success('Respuesta guardada');
      setRespuesta('');
    } catch (err) {
      toast.error('No se pudo guardar la respuesta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mt-3">
      <textarea
        value={respuesta}
        onChange={e => setRespuesta(e.target.value)}
        className="w-full border rounded p-2 text-sm"
        rows={3}
        placeholder="Responder a esta reseña..."
      />
      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs ${sePasoDelLimite ? 'text-red-600' : 'text-gray-500'}`}>
          {caracteresUsados}/{LIMITE_CARACTERES}
        </span>
        <button
          onClick={guardarRespuesta}
          disabled={cargando || !respuesta.trim() || sePasoDelLimite}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : 'Responder'}
        </button>
      </div>
    </div>
  );
}

