// 📁 components/DashboardVendedor/DashboardResumenVendedor.tsx

import React from 'react';

interface DashboardResumenVendedorProps {
  totalVentas: number;
  promedioPorCliente: number;
  ventasActual: number;
  ventasPasadas: number;
  mesActual: string;
  mesAnterior: string;
  cambioPorcentaje: number;
  promedioResenas: number;
  cantidadResenas: number;
}

const DashboardResumenVendedor: React.FC<DashboardResumenVendedorProps> = ({
  totalVentas,
  promedioPorCliente,
  ventasActual,
  ventasPasadas,
  mesActual,
  mesAnterior,
  cambioPorcentaje,
  promedioResenas,
  cantidadResenas,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-1">💰 Total Ventas</h2>
        <p className="text-2xl text-green-600">Q{totalVentas.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Promedio por cliente: Q{promedioPorCliente.toFixed(2)}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-1">📈 Comparativa mensual</h2>
        <p className="text-sm text-gray-600">{mesAnterior}: Q{ventasPasadas.toFixed(2)}</p>
        <p className="text-sm text-gray-600">{mesActual}: Q{ventasActual.toFixed(2)}</p>
        <p className={`text-sm font-semibold ${cambioPorcentaje >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {cambioPorcentaje >= 0 ? '▲' : '▼'} {Math.abs(cambioPorcentaje).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white shadow p-4 rounded col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-1">⭐ Promedio de Calificación</h2>
        <p className="text-2xl text-yellow-500">{promedioResenas.toFixed(1)} / 5 ⭐</p>
        <p className="text-sm text-gray-500">Basado en {cantidadResenas} reseñas</p>
      </div>
    </div>
  );
};

export default DashboardResumenVendedor;