//📁 components/DashboardVendedor/ResumenRanking.tsx

import React from 'react';

interface Props {
  ventasTotales: number;
  montoTotal: number;
  promedioCalificacion: number;
  posicion?: number;
}

const ResumenRanking: React.FC<Props> = ({
  ventasTotales,
  montoTotal,
  promedioCalificacion,
  posicion,
}) => {
  return (
    <div className="bg-white shadow p-4 rounded max-w-md">
      <h2 className="text-lg font-semibold mb-3">📈 Ranking del vendedor</h2>
      <dl className="space-y-2 text-sm text-gray-700">
        <div>
          <dt className="font-medium">🛒 Ventas totales</dt>
          <dd>{ventasTotales ?? 0}</dd>
        </div>
        <div>
          <dt className="font-medium">💵 Monto total</dt>
          <dd>Q{(montoTotal ?? 0).toFixed(2)}</dd>
        </div>
        <div>
          <dt className="font-medium">⭐ Calificación promedio</dt>
          <dd>{(promedioCalificacion ?? 0).toFixed(2)} / 5</dd>
        </div>
        {posicion !== undefined && (
          <div>
            <dt className="font-medium">📊 Posición en el ranking</dt>
            <dd
              className={`font-semibold ${
                posicion === 1
                  ? 'text-yellow-500'
                  : posicion <= 3
                  ? 'text-orange-500'
                  : 'text-indigo-600'
              }`}
            >
              #{posicion}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default ResumenRanking;