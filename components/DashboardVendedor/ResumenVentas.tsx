// 📁 components/DashboardVendedor/ResumenVentas.tsx

import React from 'react';

interface Props {
  totalVentas: number;
  promedioPorCliente: number;
  ventasActual: number;
  ventasPasadas: number;
  mesActual: string;
  mesAnterior: string;
  cambioPorcentaje: number;
}

const ResumenVentas: React.FC<Props> = ({
  totalVentas,
  promedioPorCliente,
  ventasActual,
  ventasPasadas,
  mesActual,
  mesAnterior,
  cambioPorcentaje
}) => {
  return (
    <>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-1">💰 Total ventas</h2>
        <p className="text-2xl text-green-600">Q{totalVentas.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Promedio por cliente: Q{promedioPorCliente.toFixed(2)}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-1">📊 Comparación mensual</h2>
        <p className="text-gray-700">{mesActual}: Q{ventasActual.toFixed(2)}</p>
        <p className="text-gray-700">{mesAnterior}: Q{ventasPasadas.toFixed(2)}</p>
        <p className={`text-sm font-medium ${cambioPorcentaje >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          Variación: {cambioPorcentaje.toFixed(1)}%
        </p>
      </div>
    </>
  );
};

export default ResumenVentas;