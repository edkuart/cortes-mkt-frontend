// 📁 utils/estrellas.tsx

import { FaStar, FaStarHalfAlt, FaRegStar, FaGrinStars, FaFrown, FaMeh, FaSmile, FaLaugh } from 'react-icons/fa';
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

/**
 * Devuelve un emoji representando la calificación.
 * @param valor Calificación de 1 a 5
 */
export function getEmoji(valor: number): ReactNode {
  const emojis = [<FaFrown />, <FaMeh />, <FaSmile />, <FaLaugh />, <FaGrinStars />];
  return emojis[Math.max(0, Math.min(4, Math.ceil(valor) - 1))];
}

/**
 * Devuelve una etiqueta textual de la calificación.
 * @param valor Calificación de 1 a 5
 */
export function getTexto(valor: number): string {
  const textos = ['Terrible', 'Malo', 'Regular', 'Bueno', 'Excelente'];
  return textos[Math.max(0, Math.min(4, Math.ceil(valor) - 1))];
}

