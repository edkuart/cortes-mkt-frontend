// 📁 components/ResumenMensualResenas.tsx

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  CartesianGrid
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { utils, writeFile } from 'xlsx';

interface PuntoResumen {
  mes: string;
  cantidad: number;
  promedio: number;
}

const mesesNombres = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow p-2 rounded text-sm">
        <p className="font-bold">{label}</p>
        <p>📊 Reseñas: {payload[0].value}</p>
        <p>⭐ Promedio: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const ResumenMensualResenas = () => {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState<PuntoResumen[]>([]);
  const [anio, setAnio] = useState(dayjs().year().toString());
  const [mes, setMes] = useState('todos');
  const [minPromedio, setMinPromedio] = useState(0);
  const [tipo, setTipo] = useState('todas');
  const [minCantidad, setMinCantidad] = useState(0);
  const [cargando, setCargando] = useState(true);
  const graficoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!usuario?.id) return;
    setCargando(true);
    fetch(`http://localhost:4000/api/resenas/resumen/${usuario.id}`)
      .then(res => res.json())
      .then((data) => {
        const filtrado = data
          .filter((d: any) => d.mes.startsWith(anio))
          .map((d: any) => ({
            mes: d.mes,
            cantidad: parseInt(d.cantidad),
            promedio: Number(d.promedio.toFixed(2)),
          }))
          .filter((d: PuntoResumen) => {
            const coincideMes = mes === 'todos' || d.mes.endsWith(`-${mes}`);
            const coincideTipo =
              tipo === 'todas' ||
              (tipo === 'positivas' && d.promedio >= 4) ||
              (tipo === 'regulares' && d.promedio >= 3 && d.promedio < 4) ||
              (tipo === 'negativas' && d.promedio < 3);
            return coincideMes && coincideTipo && d.promedio >= minPromedio && d.cantidad >= minCantidad;
          });
        setDatos(filtrado);
      })
      .catch(() => toast.error('Error al cargar resumen de reseñas'))
      .finally(() => setCargando(false));
  }, [anio, mes, minPromedio, tipo, minCantidad, usuario]);

  const exportarComoPDF = async () => {
    if (!graficoRef.current) return;
    const canvas = await html2canvas(graficoRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resumen-reseñas-${anio}.pdf`);
  };

  const exportarComoPNG = async () => {
    if (!graficoRef.current) return;
    const canvas = await html2canvas(graficoRef.current);
    const link = document.createElement('a');
    link.download = `resumen-reseñas-${anio}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportarComoExcel = () => {
    const ws = utils.json_to_sheet(datos);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Resumen');
    writeFile(wb, `resumen-reseñas-${anio}.xlsx`);
  };

  const tituloDinamico = useMemo(() => {
    const añoTexto = anio;
    const mesTexto = mes === 'todos' ? '' : ` - ${mesesNombres[parseInt(mes) - 1]}`;
    return `${añoTexto}${mesTexto}`;
  }, [anio, mes]);

  const totalCantidad = datos.length > 0 ? datos.reduce((acc, d) => acc + d.cantidad, 0) : 0;
  const promedioGlobal = datos.length > 0 ? (datos.reduce((acc, d) => acc + d.promedio, 0) / datos.length).toFixed(2) : '0.00';
  const mejorMes = datos.length > 0 ? datos.reduce((prev, curr) => curr.promedio > prev.promedio ? curr : prev, datos[0]) : { mes: '', cantidad: 0, promedio: 0 };
  const peorMes = datos.length > 0 ? datos.reduce((prev, curr) => curr.promedio < prev.promedio ? curr : prev, datos[0]) : { mes: '', cantidad: 0, promedio: 5 };

  return (
    <section id="panel-resumen-resenas" className="bg-white p-6 shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>📊</span> Resumen Mensual de Reseñas ({tituloDinamico})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-gray-50 border rounded">
          <p className="text-sm text-gray-500">Total de Reseñas</p>
          <p className="text-lg font-semibold text-indigo-600">{totalCantidad}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded">
          <p className="text-sm text-gray-500">Promedio Global</p>
          <p className="text-lg font-semibold text-yellow-600">{promedioGlobal}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded">
          <p className="text-sm text-gray-500">Mejor Mes</p>
          <p className="text-sm">{mejorMes.mes} - ⭐ {mejorMes.promedio}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded">
          <p className="text-sm text-gray-500">Peor Mes</p>
          <p className="text-sm">{peorMes.mes} - ⭐ {peorMes.promedio}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label>Año:
          <select value={anio} onChange={(e) => setAnio(e.target.value)} className="ml-2 px-2 py-1 border rounded">
            {Array.from({ length: 4 }, (_, i) => {
              const year = dayjs().year() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </label>

        <label>Mes:
          <select value={mes} onChange={(e) => setMes(e.target.value)} className="ml-2 px-2 py-1 border rounded">
            <option value="todos">Todos</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = `${i + 1}`.padStart(2, '0');
              return <option key={month} value={month}>{mesesNombres[i]}</option>;
            })}
          </select>
        </label>

        <label>Calificación mínima:
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={minPromedio}
            onChange={(e) => setMinPromedio(parseFloat(e.target.value))}
            className="ml-2 px-2 py-1 border rounded w-20"
          />
        </label>

        <label>Tipo:
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="ml-2 px-2 py-1 border rounded">
            <option value="todas">Todas</option>
            <option value="positivas">Positivas (≥ 4)</option>
            <option value="regulares">Regulares (= 3)</option>
            <option value="negativas">Negativas (≤ 2)</option>
          </select>
        </label>

        <label>Reseñas mínimas:
          <input
            type="number"
            min="0"
            value={minCantidad}
            onChange={(e) => setMinCantidad(parseInt(e.target.value))}
            className="ml-2 px-2 py-1 border rounded w-20"
          />
        </label>

        <button
          onClick={exportarComoPDF}
          className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >📄 Exportar PDF</button>
        <button
          onClick={exportarComoPNG}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >🖼️ Descargar PNG</button>
        <button
          onClick={exportarComoExcel}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >📊 Exportar Excel</button>
      </div>

      {cargando ? <p className="text-gray-500">Cargando datos...</p> : (
        <div ref={graficoRef} className="bg-white p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datos} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#4F46E5" name="Cantidad de reseñas" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="promedio" stroke="#F59E0B" name="Calificación promedio" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default ResumenMensualResenas;

