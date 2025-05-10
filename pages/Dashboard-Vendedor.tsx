// 📊 Dashboard del Vendedor — Integración completa
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line } from 'recharts';
import {
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Pedido {
  id: number;
  total: number;
  createdAt: string;
  estadoTexto: string;
  categoria: string 
  comprador?: { nombreCompleto: string };
  detalles: { producto: { nombre: string }; cantidad: number }[];
}

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  compradorId: number;
  createdAt: string;
  Comprador?: { nombreCompleto: string };
}

interface RankingData {
  promedio_calificacion: number;
  ventas_totales: number;
  monto_total: number;
  posicion?: number;
}

export default function DashboardVendedor() {
  const { usuario, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [ranking, setRanking] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(dayjs().format('YYYY-MM-DD'));
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [devoluciones, setDevoluciones] = useState([]);



  const restablecerFechas = () => {
    setFechaInicio(dayjs().startOf('month').format('YYYY-MM-DD'));
    setFechaFin(dayjs().format('YYYY-MM-DD'));
  };

  const exportarResumenPDF = () => {
    const input = document.getElementById('resumen-pdf');
    if (!input) return;

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resumen-vendedor.pdf');
    });
  };

  

  
  useEffect(() => {
    if (!isAuthenticated() || !usuario) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/pedidos?vendedorId=${usuario.id}`)
      .then(res => res.json())
      .then(setPedidos)
      .catch(() => toast.error('Error al obtener pedidos'))
      .finally(() => setLoading(false));

    fetch(`http://localhost:4000/api/devoluciones?vendedorId=${usuario.id}`)
      .then(res => res.json())
      .then(setDevoluciones)
      .catch(() => toast.error('Error al obtener devoluciones'));

    fetch(`http://localhost:4000/api/reseñas/vendedor/${usuario.id}`)
      .then(res => res.json())
      .then(setResenas)
      .catch(() => toast.error('Error al obtener reseñas'));

    fetch(`http://localhost:4000/api/vendedores/${usuario.id}/ranking`)
      .then(res => res.json())
      .then(setRanking)
      .catch(() => toast.error('Error al obtener ranking'));
  }, [usuario]);
 
  const pedidosFiltrados = pedidos.filter(p =>
    (!fechaInicio || !dayjs(p.createdAt).isBefore(fechaInicio)) &&
    (!fechaFin || !dayjs(p.createdAt).isAfter(fechaFin))
  );

  const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
  const clientesTotales = new Set(pedidosFiltrados.map(p => p.comprador?.nombreCompleto)).size;
  const promedioPorCliente = clientesTotales ? totalVentas / clientesTotales : 0;

  const ventasPorCliente = pedidosFiltrados.reduce((acc, p) => {
    const cliente = p.comprador?.nombreCompleto || 'Desconocido';
    acc[cliente] = (acc[cliente] || 0) + p.total;
    return acc;
  }, {} as Record<string, number>);

  const topClientes = Object.entries(ventasPorCliente)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, total]) => ({ nombre, total }));

  const productosVendidos = pedidosFiltrados.flatMap(p => p.detalles);
  const rankingProductos = productosVendidos.reduce((acc, d) => {
    const nombre = d.producto.nombre;
    acc[nombre] = (acc[nombre] || 0) + d.cantidad;
    return acc;
  }, {} as Record<string, number>);

  const productosMasVendidos = Object.entries(rankingProductos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));

  const ventasPorMes = pedidos.reduce((acc, p) => {
    const mes = dayjs(p.createdAt).format('YYYY-MM');
    acc[mes] = (acc[mes] || 0) + p.total;
    return acc;
  }, {} as Record<string, number>);

  const ahora = dayjs();
  const mesActual = ahora.format('YYYY-MM');
  const mesAnterior = ahora.subtract(1, 'month').format('YYYY-MM');
  const ventasActual = ventasPorMes[mesActual] || 0;
  const ventasPasadas = ventasPorMes[mesAnterior] || 0;
  const cambioPorcentaje = ventasPasadas ? ((ventasActual - ventasPasadas) / ventasPasadas) * 100 : 0;

  const sinPedidosRecientes = !pedidos.some(p => dayjs(p.createdAt).isAfter(ahora.subtract(7, 'day')));
  const promedioResenas = resenas.length > 0 ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length) : 0;

  return (
    
    <div className="max-w-6xl mx-auto p-6" id="resumen-pdf">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard del Vendedor</h1>

      <div className="mb-4">
        <button
          onClick={exportarResumenPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📄 Exportar resumen a PDF
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label>Desde:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
        </label>
        <label>Hasta:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
        </label>
        <button onClick={restablecerFechas} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm">Restablecer fechas</button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label>Categorías:
            <select
            multiple
            value={categoriasSeleccionadas}
            onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setCategoriasSeleccionadas(options);
            }}
            className="ml-2 border px-2 py-1 rounded"
            size={4}
            >
            <option value="corte">Cortes</option>
            <option value="traje_completo">Trajes completos</option>
            <option value="accesorio">Accesorios</option>
            <option value="combo">Combos</option>
            </select>
        </label>

        <label>Año:
            <select
            value={fechaInicio.slice(0, 4)}
            onChange={e => {
                const nuevoAnio = e.target.value;
                setFechaInicio(`${nuevoAnio}-01-01`);
                setFechaFin(`${nuevoAnio}-12-31`);
            }}
            className="ml-2 border px-2 py-1 rounded"
            >
            {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
            })}
            </select>
        </label>

        <button
            onClick={() => {
            const chart = document.getElementById('grafico-evolucion');
            if (!chart) return;
            html2canvas(chart).then(canvas => {
                const link = document.createElement('a');
                link.download = 'grafico-evolucion-mensual.png';
                link.href = canvas.toDataURL();
                link.click();
            });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
            📸 Descargar gráfica mensual
        </button>
        </div>

        <div id="grafico-evolucion" className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">📆 Evolución mensual de ventas, pedidos y calificaciones</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                data={Object.entries(ventasPorMes)
                    .filter(([mes]) => mes.startsWith(fechaInicio.slice(0, 4)))
                    .map(([mes]) => {
                    const pedidosMes = pedidos.filter(p => {
                        const esDelMes = dayjs(p.createdAt).format('YYYY-MM') === mes;
                        if (categoriasSeleccionadas.length === 0) return esDelMes;
                        return esDelMes && p.detalles.some(d => {
                            const categoria = (d.producto as any).categoria;
                            return categoriasSeleccionadas.includes(categoria);
                          });
                          
                    });

                    const totalMes = pedidosMes.reduce((acc, p) => acc + p.total, 0);

                    const resenasMes = resenas.filter(r => dayjs(r.createdAt).format('YYYY-MM') === mes);
                    const promedioCalif = resenasMes.length > 0
                        ? resenasMes.reduce((sum, r) => sum + r.calificacion, 0) / resenasMes.length
                        : null;

                    return {
                        mes,
                        total: totalMes,
                        pedidos: pedidosMes.length,
                        calificacion: promedioCalif
                    };
                    })}
                >
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Ventas (Q)" />
                <Line type="monotone" dataKey="pedidos" stroke="#82ca9d" strokeWidth={2} name="Pedidos" />
                <Line type="monotone" dataKey="calificacion" stroke="#ffc658" strokeWidth={2} name="Calificación Promedio" />
                </LineChart>
            </ResponsiveContainer>
        </div>
            
        <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded mt-6">
        <h2 className="text-lg font-semibold mb-2">📦 Solicitudes de Devolución</h2>
        <table className="w-full text-sm">
            <thead>
            <tr className="bg-gray-100">
                <th className="text-left p-2">Producto</th>
                <th className="text-left p-2">Motivo</th>
                <th className="text-left p-2">Fecha</th>
                <th className="text-center p-2">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {[ // Datos simulados por ahora
                { id: 1, producto: 'Traje Negro', motivo: 'Talla incorrecta', fecha: '2024-11-01' },
                { id: 2, producto: 'Accesorio X', motivo: 'No es lo que esperaba', fecha: '2024-11-05' }
            ].map(dev => (
                <tr key={dev.id} className="border-t">
                <td className="p-2">{dev.producto}</td>
                <td className="p-2">{dev.motivo}</td>
                <td className="p-2">{dayjs(dev.fecha).format('DD/MM/YYYY')}</td>
                <td className="p-2 text-center space-x-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">
                    Aceptar
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                    Rechazar
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>


      {loading ? <p>Cargando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-1">Total ventas</h2>
            <p className="text-2xl text-green-600">Q{totalVentas.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Promedio por cliente: Q{promedioPorCliente.toFixed(2)}</p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-1">Comparación mensual</h2>
            <p className="text-gray-700">{mesActual}: Q{ventasActual.toFixed(2)}</p>
            <p className="text-gray-700">{mesAnterior}: Q{ventasPasadas.toFixed(2)}</p>
            <p className={`text-sm font-medium ${cambioPorcentaje >= 0 ? 'text-green-600' : 'text-red-500'}`}>Variación: {cambioPorcentaje.toFixed(1)}%</p>
          </div>

          {ranking && (
            <div className="bg-white shadow p-4 rounded">
              <h2 className="text-lg font-semibold mb-1">📈 Ranking del vendedor</h2>
              <p className="text-sm text-gray-700">Ventas totales: {ranking.ventas_totales}</p>
              <p className="text-sm text-gray-700">Monto total: Q{ranking.monto_total.toFixed(2)}</p>
              <p className="text-sm text-gray-700">Calificación promedio: {ranking.promedio_calificacion.toFixed(2)} ⭐</p>
              {ranking.posicion && <p className="text-sm text-indigo-600">Posición en el ranking: #{ranking.posicion}</p>}
            </div>
          )}

          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-1">⭐ Promedio de Calificación</h2>
            <p className="text-2xl text-yellow-500">{promedioResenas.toFixed(1)} / 5 ⭐</p>
            <p className="text-sm text-gray-500">Basado en {resenas.length} reseñas</p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Top 5 clientes</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topClientes}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Top productos más vendidos</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productosMasVendidos}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {sinPedidosRecientes && (
            <div className="col-span-1 md:col-span-2 bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-800">
              ⚠️ No has recibido pedidos en los últimos 7 días. Considerá hacer una promoción o revisar tu stock.
            </div>
          )}

          {resenas.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Últimas reseñas</h2>
              <ul className="space-y-2">
                {resenas.slice(0, 5).map((r) => (
                  <li key={r.id} className="border-b pb-2">
                    <p className="text-sm text-gray-700">⭐ {r.calificacion} - "{r.comentario}"</p>
                    <p className="text-xs text-gray-500">{r.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(r.createdAt).format('DD/MM/YYYY')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
