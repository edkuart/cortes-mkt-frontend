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
  const esAumento = cambioPorcentaje >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">💰 Total ventas</h2>
        <dl className="text-sm text-gray-700 space-y-1">
          <div>
            <dt className="font-medium">🧾 Monto acumulado</dt>
            <dd className="text-green-600 text-xl font-bold">Q{totalVentas.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-medium">👤 Promedio por cliente</dt>
            <dd>Q{promedioPorCliente.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div className={`shadow p-4 rounded ${esAumento ? 'bg-green-50' : 'bg-red-50'}`}> 
        <h2 className="text-lg font-semibold mb-2">📊 Comparación mensual</h2>
        <dl className="text-sm text-gray-700 space-y-1">
          <div>
            <dt className="font-medium">📆 {mesActual}</dt>
            <dd className="font-semibold">Q{ventasActual.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-medium">📆 {mesAnterior}</dt>
            <dd>Q{ventasPasadas.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-medium">📈 Variación</dt>
            <dd className={`font-bold ${esAumento ? 'text-green-600' : 'text-red-500'}`}>
              {esAumento ? '📈' : '📉'} {cambioPorcentaje.toFixed(1)}%
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ResumenVentas;