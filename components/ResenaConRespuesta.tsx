// 📄 components/ResenaConRespuesta.tsx

import ResponderResenaBox from './ResponderResenaBox';
import { useState } from 'react';
import dayjs from 'dayjs';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  respuestaVendedor?: string;
  Comprador?: {
    nombreCompleto: string;
  };
}

interface Props {
  resena: Resena;
  onRespuestaGuardada: (id: number, respuesta: string) => void;
}

export default function ResenaConRespuesta({ resena, onRespuestaGuardada }: Props) {
  const [respondiendo, setRespondiendo] = useState(false);

  return (
    <div className="border-b pb-3">
      <p className="text-sm text-gray-700">⭐ {resena.calificacion} - "{resena.comentario}"</p>
      <p className="text-xs text-gray-500">{resena.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(resena.createdAt).format('DD/MM/YYYY')}</p>

      {resena.respuestaVendedor ? (
        <div className="mt-1 text-sm text-indigo-700 bg-indigo-50 border-l-4 border-indigo-400 pl-2">
          <strong>Respuesta:</strong> {resena.respuestaVendedor}
        </div>
      ) : respondiendo ? (
        <ResponderResenaBox
          resenaId={resena.id}
          onGuardado={(respuesta) => {
            setRespondiendo(false);
            onRespuestaGuardada(resena.id, respuesta);
          }}
        />
      ) : (
        <button
          onClick={() => setRespondiendo(true)}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          Responder
        </button>
      )}
    </div>
  );
}



