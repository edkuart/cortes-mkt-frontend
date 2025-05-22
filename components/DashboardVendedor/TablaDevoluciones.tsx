//📁 components/DashboardVendedor/TablaDevoluciones.tsx

import React from 'react';
import dayjs from 'dayjs';

interface Devolucion {
  id: number;
  motivo: string;
  createdAt: string;
  producto?: { nombre: string };
}

interface Props {
  devoluciones: Devolucion[];
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

const TablaDevoluciones: React.FC<Props> = ({ devoluciones, onAceptar, onRechazar }) => {
  return (
    <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded mt-6">
      <h2 className="text-lg font-semibold mb-2">📦 Solicitudes de Devolución</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Producto</th>
            <th className="text-left p-2">Motivo</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-center p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
        {(Array.isArray(devoluciones) ? devoluciones : []).map(dev => (
            <tr key={dev.id} className="border-t">
            <td className="p-2">{dev.producto?.nombre || 'Producto'}</td>
            <td className="p-2">{dev.motivo}</td>
            <td className="p-2">{dayjs(dev.createdAt).format('DD/MM/YYYY')}</td>
            <td className="p-2 text-center space-x-2">
                <button
                onClick={() => onAceptar(dev.id)}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                >
                Aceptar
                </button>
                <button
                onClick={() => onRechazar(dev.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                Rechazar
                </button>
            </td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDevoluciones;