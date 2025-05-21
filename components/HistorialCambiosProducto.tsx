// 📁 frontend/components/HistorialCambiosProducto.tsx

import { useEffect, useState } from 'react';

interface Cambio {
  id: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  createdAt: string;
}

export default function HistorialCambiosProducto({ productoId }: { productoId: number }) {
  const [cambios, setCambios] = useState<Cambio[]>([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/historial/${productoId}`)
      .then(res => res.json())
      .then(setCambios)
      .catch(err => console.error('Error al cargar historial:', err));
  }, [productoId]);

  if (!cambios.length) return <p className="text-gray-500">Sin historial de cambios.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Historial de cambios</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Fecha</th>
            <th className="p-2">Campo</th>
            <th className="p-2">Antes</th>
            <th className="p-2">Después</th>
          </tr>
        </thead>
        <tbody>
          {cambios.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
              <td className="p-2">{c.campo}</td>
              <td className="p-2">{c.valorAnterior}</td>
              <td className="p-2">{c.valorNuevo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}