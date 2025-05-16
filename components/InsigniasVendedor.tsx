// 📦 components/InsigniasVendedor.tsx

import { useEffect, useState } from 'react';

interface Ranking {
  promedioCalificacion: number;
  ventasTotales: number;
  montoTotal: number;
}

interface Props {
  vendedorId?: number;
  ranking?: Ranking;
}

export default function InsigniasVendedor({ vendedorId, ranking: initialRanking }: Props) {
  const [ranking, setRanking] = useState<Ranking | null>(initialRanking || null);

  useEffect(() => {
    if (!initialRanking && vendedorId) {
      fetch(`http://localhost:4000/api/vendedores/${vendedorId}/ranking`)
        .then(res => res.ok ? res.json() : null)
        .then(setRanking)
        .catch(() => setRanking(null));
    }
  }, [vendedorId]);

  if (!ranking) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {ranking.promedioCalificacion >= 4.5 && (
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full shadow-sm">
          🏅 Vendedor Muy Valorad@
        </span>
      )}

      {ranking.ventasTotales >= 100 && (
        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full shadow-sm">
          🥇 Top en Ventas
        </span>
      )}

      {ranking.montoTotal >= 10000 && (
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full shadow-sm">
          💼 Vendedor Élite
        </span>
      )}
    </div>
  );
}
 