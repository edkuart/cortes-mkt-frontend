// 📁 components/Admin/GraficaEstadisticas.tsx

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EntradaEstadistica {
  semana: string;
  cantidad: number;
}

const GraficaEstadisticas = () => {
  const [datos, setDatos] = useState<EntradaEstadistica[]>([]);

  useEffect(() => {
    // Datos simulados. Luego conectar a /api/admin/estadisticas
    setDatos([
      { semana: '2024-W18', cantidad: 3 },
      { semana: '2024-W19', cantidad: 5 },
      { semana: '2024-W20', cantidad: 7 },
      { semana: '2024-W21', cantidad: 2 },
      { semana: '2024-W22', cantidad: 6 },
    ]);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Usuarios nuevos por semana</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semana" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cantidad" stroke="#0b3d91" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaEstadisticas;
