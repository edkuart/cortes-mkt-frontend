// 📁 frontend/pages/resenas/resumen.tsx

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';

interface ResumenMensual {
  mes: string;
  cantidad: number;
  promedio: number;
}

const ResumenMensualResenas = () => {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState<ResumenMensual[]>([]);
  const [anioActual, setAnioActual] = useState<string>(new Date().getFullYear().toString());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    setCargando(true);

    fetch(`http://localhost:4000/api/resenas/vendedor/${usuario.id}/resumen-mensual`)
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(() => setDatos([]))
      .finally(() => setCargando(false));
  }, [usuario]);

  const datosFiltrados = datos
    .filter(d => d.mes.startsWith(anioActual))
    .map(d => ({
      mes: d.mes,
      cantidad: Number(d.cantidad),
      promedio: parseFloat(Number(d.promedio).toFixed(2))
    }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Head>
        <title>Resumen Mensual de Reseñas</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">📊 Resumen Mensual de Reseñas</h1>
      <label className="mb-4 block">
        Filtrar por año:
        <select
          className="ml-2 border px-2 py-1 rounded"
          value={anioActual}
          onChange={e => setAnioActual(e.target.value)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </label>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosFiltrados}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" strokeWidth={2} name="Cantidad de Reseñas" />
            <Line type="monotone" dataKey="promedio" stroke="#ffc658" strokeWidth={2} name="Promedio de Calificación" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ResumenMensualResenas;

