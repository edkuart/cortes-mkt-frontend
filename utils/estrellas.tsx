// 📁 utils/estrellas.tsx

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ReactNode } from 'react';

/**
 * Retorna el ícono correspondiente de estrella completa, media o vacía.
 * @param i Índice de la estrella.
 * @param current Calificación actual (puede ser decimal).
 * @returns Componente ReactNode del ícono.
 */
export function renderIcon(i: number, current: number): ReactNode {
  const floor = Math.floor(current);
  const showHalf = current % 1 >= 0.5 && i === floor;

  if (showHalf) {
    return <FaStarHalfAlt key={i} />;
  }

  return i < current ? <FaStar key={i} /> : <FaRegStar key={i} />;
}
