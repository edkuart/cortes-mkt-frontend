// 📁 components/DashboardVendedor/TablaDevoluciones.tsx

import React from 'react';
import dayjs from 'dayjs';

interface Devolucion {
  id: number;
  motivo: string;
  createdAt: string;
  estado?: 'pendiente' | 'aceptada' | 'rechazada';
  producto?: { nombre: string };
}

interface Props {
  devoluciones: Devolucion[];
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

const TablaDevoluciones: React.FC<Props> = ({ devoluciones, onAceptar, onRechazar }) => {
  if (!Array.isArray(devoluciones)) {
    return <p className="text-center text-red-600">⚠️ Error: Las devoluciones no son un arreglo válido.</p>;
  }

  return (
    <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">📦 Solicitudes de Devolución</h2>

      {devoluciones.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No hay solicitudes de devolución.</p>
      ) : (
        <table className="w-full text-sm" role="table" aria-label="Tabla de solicitudes de devolución">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2">Motivo</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-center p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {devoluciones.map(dev => (
              <tr key={dev.id} className="border-t">
                <td className="p-2">{dev.producto?.nombre || 'Producto'}</td>
                <td className="p-2">{dev.motivo}</td>
                <td className="p-2">{dayjs(dev.createdAt).format('DD/MM/YYYY')}</td>
                <td className="p-2">
                  {dev.estado === 'aceptada' && <span className="text-green-600">✅ Aceptada</span>}
                  {dev.estado === 'rechazada' && <span className="text-red-600">❌ Rechazada</span>}
                  {(!dev.estado || dev.estado === 'pendiente') && <span className="text-yellow-600">🕒 Pendiente</span>}
                </td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => confirm('¿Aceptar esta devolución?') && onAceptar(dev.id)}
                    disabled={dev.estado !== 'pendiente'}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                    aria-label="Aceptar devolución"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => confirm('¿Rechazar esta devolución?') && onRechazar(dev.id)}
                    disabled={dev.estado !== 'pendiente'}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                    aria-label="Rechazar devolución"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaDevoluciones;