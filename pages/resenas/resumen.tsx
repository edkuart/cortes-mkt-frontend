// 📁 frontend/pages/resenas/resumen.tsx

import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumenMensual {
  mes: string;
  cantidad: number;
  promedio: number;
}

const ResumenMensualResenas = () => {
  const { user } = useAuth();
  const [datos, setDatos] = useState<ResumenMensual[]>([]);
  const [anioActual, setAnioActual] = useState<string>(new Date().getFullYear().toString());
  const [cargando, setCargando] = useState(true);
  const refGrafico = useRef(null);

  useEffect(() => {
    if (!user) return;
    setCargando(true);

    fetch(`http://localhost:4000/api/resenas/vendedor/${user.id}/resumen-mensual`)
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(() => setDatos([]))
      .finally(() => setCargando(false));
  }, [user]);

  const datosFiltrados = datos
    .filter(d => d.mes.startsWith(anioActual))
    .map(d => ({
      mes: d.mes,
      cantidad: Number(d.cantidad),
      promedio: parseFloat(Number(d.promedio).toFixed(2))
    }));

  const exportarCSV = () => {
    if (!datosFiltrados.length) return;

    const encabezado = 'Mes,Cantidad de Reseñas,Promedio de Calificación\n';
    const filas = datosFiltrados.map(d => `${d.mes},${d.cantidad},${d.promedio}`);
    const csv = encabezado + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resumen-reseñas-${anioActual}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = async () => {
    if (!refGrafico.current) return;
    const canvas = await html2canvas(refGrafico.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resumen-reseñas-${anioActual}.pdf`);
  };

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

      <div className="flex gap-2 mb-4">
        <button onClick={exportarCSV} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
          📤 Exportar CSV
        </button>
        <button onClick={exportarPDF} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          📄 Exportar PDF
        </button>
      </div>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <div ref={refGrafico} className="bg-white p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosFiltrados}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cantidad" stroke="#8884d8" strokeWidth={2} name="Cantidad de Reseñas" />
              <Line type="monotone" dataKey="promedio" stroke="#ffc658" strokeWidth={2} name="Promedio de Calificación" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ResumenMensualResenas;