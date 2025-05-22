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
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-lg font-semibold mb-1">📈 Ranking del vendedor</h2>
      <p className="text-sm text-gray-700">
        Ventas totales: {ventasTotales ?? 0}
        </p>
      <p className="text-sm text-gray-700">
        Monto total: Q{(montoTotal ?? 0).toFixed(2)}
        </p>
        <p className="text-sm text-gray-700">
        Calificación promedio: {(promedioCalificacion ?? 0).toFixed(2)} ⭐
        </p>
      {posicion !== undefined && (
        <p className="text-sm text-indigo-600">Posición en el ranking: #{posicion}</p>
      )}
    </div>
  );
};

export default ResumenRanking;