// 📁 components/Admin/TablaReportes.tsx

import { useEffect, useState } from 'react';
import { FaCheck, FaEye, FaTrash } from 'react-icons/fa';

interface Reporte {
  id: number;
  tipo: 'producto' | 'resena' | 'mensaje';
  motivo: string;
  objetivoId: number;
  usuario: string;
  fecha: string;
  resuelto: boolean;
}

const TablaReportes = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);

  useEffect(() => {
    // Simulación de datos. Luego se conecta con /api/reportes
    setReportes([
      {
        id: 101,
        tipo: 'producto',
        motivo: 'Información engañosa',
        objetivoId: 45,
        usuario: 'juan.perez@example.com',
        fecha: '2024-05-27',
        resuelto: false,
      },
      {
        id: 102,
        tipo: 'resena',
        motivo: 'Insultos',
        objetivoId: 88,
        usuario: 'luis.garcia@example.com',
        fecha: '2024-05-26',
        resuelto: true,
      },
    ]);
  }, []);

  const resolverReporte = (id: number) => {
    setReportes(prev =>
      prev.map(r => (r.id === id ? { ...r, resuelto: true } : r))
    );
    // PATCH /api/reportes/:id/resolver
  };

  const eliminarReporte = (id: number) => {
    if (confirm('¿Eliminar este reporte definitivamente?')) {
      setReportes(prev => prev.filter(r => r.id !== id));
      // DELETE /api/reportes/:id
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Reportes de Usuarios</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm">
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Motivo</th>
              <th className="px-4 py-2">ID Objetivo</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {reportes.map(reporte => (
              <tr key={reporte.id}>
                <td className="px-4 py-2 capitalize">{reporte.tipo}</td>
                <td className="px-4 py-2">{reporte.motivo}</td>
                <td className="px-4 py-2">#{reporte.objetivoId}</td>
                <td className="px-4 py-2">{reporte.usuario}</td>
                <td className="px-4 py-2">{reporte.fecha}</td>
                <td className="px-4 py-2">
                  {reporte.resuelto ? (
                    <span className="text-green-600 font-semibold">Resuelto</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Pendiente</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    title="Ver detalle"
                  >
                    <FaEye />
                  </button>
                  {!reporte.resuelto && (
                    <button
                      onClick={() => resolverReporte(reporte.id)}
                      className="text-green-600 hover:text-green-700"
                      title="Marcar como resuelto"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarReporte(reporte.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Eliminar reporte"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaReportes;
