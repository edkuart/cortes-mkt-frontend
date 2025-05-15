// 🗨️ components/ResponderResenaBox.tsx

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  resenaId: number;
  onGuardado: (texto: string) => void;
}

export default function ResponderResenaBox({ resenaId, onGuardado }: Props) {
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const guardarRespuesta = async () => {
    if (!respuesta.trim()) return toast.error('La respuesta no puede estar vacía');
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
        rows={2}
        placeholder="Responder a esta reseña..."
      />
      <button
        onClick={guardarRespuesta}
        disabled={cargando}
        className="mt-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        {cargando ? 'Guardando...' : 'Responder'}
      </button>
    </div>
  );
}
