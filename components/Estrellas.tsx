// 📄 components/Estrellas.tsx

import { useEffect, useState } from 'react';
import { getEmoji, getTexto, renderIcon } from '@/utils/estrellas';

interface EstrellasProps {
  calificacion: number;
  onChange?: (valor: number) => void;
  editable?: boolean;
  maximo?: number;
}

export default function Estrellas({ calificacion, onChange, editable = false, maximo = 5 }: EstrellasProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [animacion, setAnimacion] = useState(false);
  const [offlineRating, setOfflineRating] = useState<number | null>(null);

  const colores = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-green-500'];
  const valor = hover ?? calificacion;

  const playFeedback = () => {
    if (navigator.vibrate) navigator.vibrate(100);
    setAnimacion(true);
    setTimeout(() => setAnimacion(false), 400);
  };

  const guardarOffline = (valor: number) => {
    setOfflineRating(valor);
    localStorage.setItem('resenaOffline', JSON.stringify(valor));
  };

  const handleSetCalificacion = (valor: number) => {
    playFeedback();
    if (!navigator.onLine) {
      guardarOffline(valor);
      return;
    }
    onChange?.(valor);
  };

  useEffect(() => {
    if (!navigator.onLine) {
      const guardado = localStorage.getItem('resenaOffline');
      if (guardado) setOfflineRating(parseFloat(guardado));
    }
  }, []);

  return (
    <div className={`flex flex-col items-start gap-2 ${animacion ? 'animate-ping-once' : ''}`}>
      <div className="flex text-2xl">
        {Array.from({ length: maximo }).map((_, i) => {
          const color = colores[Math.min(i, colores.length - 1)];
          const activo = i < Math.ceil(valor);

          return (
            <span
              key={i}
              className={`transition-transform duration-150 ${editable ? 'cursor-pointer hover:scale-125' : ''} ${activo ? color : 'text-gray-300'}`}
              onClick={() => editable && handleSetCalificacion(i + 1)}
              onMouseEnter={() => editable && setHover(i + 1)}
              onMouseLeave={() => editable && setHover(null)}
            >
              {renderIcon(i, valor)}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-700 mt-1 animate-fade-in">
        <span className="font-medium">{valor} de {maximo}</span>
        <span className="text-xl">{getEmoji(valor)}</span>
        <span className="italic text-gray-500">{getTexto(valor)}</span>
      </div>
    </div>
  );
}



