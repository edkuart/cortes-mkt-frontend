// 📁 components/DashboardVendedor/TopClientes.tsx

import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface ClienteData {
  nombre: string;
  total: number;
}

interface Props {
  topClientes: ClienteData[];
  totalVentasGlobal?: number;
}

const TopClientes: React.FC<Props> = ({ topClientes, totalVentasGlobal }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportarPDF = () => {
    const input = chartRef.current;
    if (!input) return toast.error('No se encontró el gráfico de clientes');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('top-clientes.pdf');
    });
  };

  const exportarCSV = () => {
    if (topClientes.length === 0) return toast.error('No hay clientes para exportar');

    const encabezado = 'Cliente,Total\n';
    const filas = topClientes.map((c) => `"${c.nombre}","${c.total.toFixed(2)}"`);
    const csv = encabezado + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'top-clientes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (topClientes.length === 0) return null;

  const total = topClientes.reduce((acc, c) => acc + c.total, 0);
  const porcentajeSobreGlobal = totalVentasGlobal ? ((total / totalVentasGlobal) * 100).toFixed(1) : null;

  const obtenerIcono = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '👤';
  };

  return (
    <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🎖 Top clientes</h2>
        <div className="flex gap-2">
          <button onClick={exportarPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm" aria-label="Exportar gráfico como PDF">PDF</button>
          <button onClick={exportarCSV} className="px-3 py-1 bg-green-600 text-white rounded text-sm" aria-label="Exportar datos como CSV">CSV</button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        💰 Total gastado entre los 5 mejores clientes: <span className="font-semibold text-gray-800">Q{total.toFixed(2)}</span>
        {porcentajeSobreGlobal && (
          <span className="text-xs text-gray-500 ml-2" title="Porcentaje del total de ventas globales">
            ({porcentajeSobreGlobal}% del total global)
          </span>
        )}
      </p>

      <div ref={chartRef} id="grafico-clientes">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topClientes} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              interval={0}
              height={60}
              aria-label="Nombre del cliente"
            />
            <YAxis tickFormatter={(value) => `Q${value}`} aria-label="Total gastado en quetzales" />
            <Tooltip formatter={(value: number) => `Q${value.toFixed(2)} (${((value / total) * 100).toFixed(1)}%)`} />
            <Bar dataKey="total" fill="#00C49F" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="total" position="top" formatter={(val: number) => `Q${val}`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ul className="mt-4 space-y-1 text-sm">
          {topClientes.map((c, i) => (
            <li key={i}>
              <span className="mr-2">{obtenerIcono(i)}</span>
              {c.nombre}: <span className="font-semibold text-gray-700">Q{c.total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopClientes;