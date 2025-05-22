//📁 components/DashboardVendedor/GraficoEvolucion.tsx

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface MesData {
  mes: string;
  total: number;
  pedidos: number;
  calificacion: number | null;
}

interface Props {
  datos: MesData[];
  año: string;
}

const GraficoEvolucion: React.FC<Props> = ({ datos, año }) => {
  const datosFiltrados = datos.filter(d => d.mes.startsWith(año));

  return (
    <div id="grafico-evolucion" className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">📆 Evolución mensual de ventas, pedidos y calificaciones</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosFiltrados}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Ventas (Q)" />
          <Line type="monotone" dataKey="pedidos" stroke="#82ca9d" strokeWidth={2} name="Pedidos" />
          <Line type="monotone" dataKey="calificacion" stroke="#ffc658" strokeWidth={2} name="Calificación Promedio" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEvolucion;