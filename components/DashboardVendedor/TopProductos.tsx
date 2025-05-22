// 📁 components/DashboardVendedor/TopProductos.tsx

import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface ProductoData {
  nombre: string;
  cantidad: number;
}

interface Props {
  productosMasVendidos: ProductoData[];
  totalProductosGlobal?: number;
}

const TopProductos: React.FC<Props> = ({ productosMasVendidos, totalProductosGlobal }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ordenAsc, setOrdenAsc] = useState(false);
  const [topN, setTopN] = useState(5);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [mostrarGrafico, setMostrarGrafico] = useState(true);

  const exportarPDF = () => {
    const input = chartRef.current;
    if (!input) return toast.error('No se encontró el gráfico de productos');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('top-productos.pdf');
    });
  };

  const exportarCSV = () => {
    if (productosFiltrados.length === 0) return toast.error('No hay productos para exportar');

    const encabezado = 'Producto,Cantidad\n';
    const filas = productosFiltrados.map((p) => `"${p.nombre}","${p.cantidad}"`);
    const csv = encabezado + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'top-productos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const productosFiltrados = productosMasVendidos
    .filter(p => p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
    .sort((a, b) => ordenAsc ? a.cantidad - b.cantidad : b.cantidad - a.cantidad)
    .slice(0, topN);

  const total = productosFiltrados.reduce((acc, p) => acc + p.cantidad, 0);
  const porcentajeGlobal = totalProductosGlobal ? ((total / totalProductosGlobal) * 100).toFixed(1) : null;

  const obtenerIcono = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '📦';
  };

  const colores = ['#FFD700', '#C0C0C0', '#CD7F32', '#6B7280', '#EC4899'];

  return (
    <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🔥 Top productos más vendidos</h2>
        <div className="flex gap-2">
          <button onClick={() => setMostrarGrafico(!mostrarGrafico)} className="px-3 py-1 bg-indigo-500 text-white rounded text-sm" title="Cambiar vista entre gráfico y tabla">{mostrarGrafico ? 'Tabla' : 'Gráfico'}</button>
          <button onClick={exportarPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm" aria-label="Exportar gráfico como PDF" title="Exportar como PDF">📄 PDF</button>
          <button onClick={exportarCSV} className="px-3 py-1 bg-green-600 text-white rounded text-sm" aria-label="Exportar datos como CSV" title="Exportar como CSV">📥 CSV</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-2">
        <label className="text-sm">🔍 Filtro por nombre:
          <input type="text" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} className="ml-2 border px-2 py-1 rounded text-sm" placeholder="Buscar..." />
        </label>
        <label className="text-sm">🎯 Top:
          <select value={topN} onChange={(e) => setTopN(parseInt(e.target.value))} className="ml-2 border px-2 py-1 rounded text-sm">
            {[3, 5, 10, 20].map(n => <option key={n} value={n}>Top {n}</option>)}
          </select>
        </label>
        <button onClick={() => setOrdenAsc(!ordenAsc)} className="px-3 py-1 bg-gray-200 text-sm rounded" title="Cambiar orden de listado">Orden: {ordenAsc ? 'Asc 🔼' : 'Desc 🔽'}</button>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="text-sm text-red-500 mt-2">⚠️ No se encontraron productos con ese nombre.</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">
            📦 Total de unidades vendidas en top: <span className="font-semibold text-gray-800">{total}</span>
            {porcentajeGlobal && (
              <span className="text-xs text-gray-500 ml-2" title="Porcentaje respecto al total global de productos vendidos">
                ({porcentajeGlobal}% del total global)
              </span>
            )}
          </p>

          <div ref={chartRef} id="grafico-productos">
            {mostrarGrafico ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productosFiltrados} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="nombre" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" interval={0} height={60} aria-label="Nombre del producto" />
                  <YAxis aria-label="Cantidad vendida" />
                  <Tooltip formatter={(value: number) => `${value} unidades (${((value / total) * 100).toFixed(1)}%)`} />
                  <Bar dataKey="cantidad">
                    <LabelList dataKey="cantidad" position="top" />
                    {productosFiltrados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <table className="w-full text-sm mt-4 border" role="table" aria-label="Tabla de productos más vendidos">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-1 px-2 text-left">#</th>
                    <th className="py-1 px-2 text-left">Producto</th>
                    <th className="py-1 px-2 text-left">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-1 px-2">{obtenerIcono(i)}</td>
                      <td className="py-1 px-2">{p.nombre}</td>
                      <td className="py-1 px-2">{p.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopProductos;