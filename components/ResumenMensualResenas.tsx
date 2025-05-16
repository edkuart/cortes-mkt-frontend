// 📁 components/ResumenMensualResenas.tsx

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

interface PuntoResumen {
  mes: string;
  cantidad: number;
  promedio: number;
}

const ResumenMensualResenas = ({ vendedorId }: { vendedorId: number }) => {
  const [resumen, setResumen] = useState<PuntoResumen[]>([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const cargarResumen = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/resenas/vendedor/${vendedorId}/resumen`);
      const data = await res.json();
      setResumen(data);
    } catch (error) {
      toast.error('Error al obtener resumen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, [vendedorId]);

  const datosFiltrados = resumen
    .filter(r => r.mes.startsWith(anioSeleccionado.toString()))
    .map(r => ({
      mes: r.mes,
      cantidad: Number(r.cantidad),
      promedio: parseFloat(Number(r.promedio).toFixed(2))
    }));

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📊 Resumen Mensual de Reseñas
      </h2>

      <label className="block mb-2">
        Filtrar por año:
        <select
          value={anioSeleccionado}
          onChange={e => setAnioSeleccionado(parseInt(e.target.value))}
          className="ml-2 border rounded px-2 py-1"
        >
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </label>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="cantidad" stroke="#8884d8" name="Cantidad de reseñas" />
            <Line yAxisId="right" type="monotone" dataKey="promedio" stroke="#ffc658" name="Calificación promedio" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ResumenMensualResenas;
