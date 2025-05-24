//frontend/pages/vendedor/ 📊 dashboard-vendedor.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line } from 'recharts';
import ResumenVentas from '@/components/DashboardVendedor/ResumenVentas';
import ResumenRanking from '@/components/DashboardVendedor/ResumenRanking';
import TopClientes from '@/components/DashboardVendedor/TopClientes';
import TopProductos from '@/components/DashboardVendedor/TopProductos';
import GraficoEvolucion from '@/components/DashboardVendedor/GraficoEvolucion';
import TablaDevoluciones from '@/components/DashboardVendedor/TablaDevoluciones';
import ResenasRecientes from '@/components/DashboardVendedor/ResenasRecientes';
import DashboardResumenVendedor from '@/components/DashboardVendedor/DashboardResumenVendedor';
import dynamic from 'next/dynamic';
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
  const { user, isAuthenticated, token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [devoluciones, setDevoluciones] = useState<any[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [ranking, setRanking] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(dayjs().format('YYYY-MM-DD'));
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtro, setFiltro] = useState<'todas' | 'positivas' | 'negativas'>('todas');

  const aceptarDevolucion = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/api/devoluciones/${id}/aceptar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Devolución aceptada');
    } catch {
      toast.error('Error al aceptar devolución');
    }
  };

  const rechazarDevolucion = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/api/devoluciones/${id}/rechazar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Devolución rechazada');
    } catch {
      toast.error('Error al rechazar devolución');
    }
  };

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
    if (!isAuthenticated() || !user) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/pedidos?vendedorId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setPedidos)
      .catch(() => toast.error('Error al obtener pedidos'))
      .finally(() => setLoading(false));

    fetch(`http://localhost:4000/api/devoluciones?vendedorId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setDevoluciones)
      .catch(() => toast.error('Error al obtener devoluciones'));

    fetch(`http://localhost:4000/api/reseñas/vendedor/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setResenas)
      .catch(() => toast.error('Error al obtener reseñas'));

    fetch(`http://localhost:4000/api/vendedores/${user.id}/ranking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setRanking(data ?? null))
      .catch(() => toast.error('Error al obtener ranking'));
  }, [user]);

  const enviarCorreoPrueba = async () => {
    const res = await fetch('http://localhost:4000/api/notificaciones/correo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        asunto: '📨 Correo de prueba desde el dashboard del vendedor',
        contenido: 'Este es un correo de prueba enviado desde tu panel.',
      }),
    });
  
    if (res.ok) {
      toast.success('Correo enviado correctamente');
    } else {
      toast.error('Error al enviar el correo');
    }
  };
  
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

  const totalProductosGlobal = productosVendidos.reduce((acc, d) => acc + d.cantidad, 0);

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

      <button
        onClick={enviarCorreoPrueba}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        📧 Enviar correo de prueba
      </button>

      <button
        onClick={exportarResumenPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📄 Exportar resumen a PDF
      </button>

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

        <GraficoEvolucion datos={
          Object.entries(ventasPorMes)
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
            })
        } año={fechaInicio.slice(0, 4)} />
            
        <TablaDevoluciones
          devoluciones={devoluciones}
          onAceptar={aceptarDevolucion}
          onRechazar={rechazarDevolucion}
        />

          <button
            onClick={async () => {
              const res = await fetch('http://localhost:4000/api/notificaciones/correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  asunto: '📨 Correo de prueba desde el marketplace',
                  contenido: 'Este es un correo de prueba enviado desde el frontend.'
                }),
              });

              if (res.ok) {
              toast.success('Correo enviado correctamente');
              } else {
                toast.error('Error al enviar el correo');
              }
            }}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mt-4"
            >
              📧 Enviar correo de prueba
            </button>

            <div className="flex flex-wrap items-center gap-4 mb-4">
            <label>
              Desde:
              <input type="date" value={filtroFechaInicio} onChange={e => setFiltroFechaInicio(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
            </label>
            <label>
              Hasta:
              <input type="date" value={filtroFechaFin} onChange={e => setFiltroFechaFin(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
            </label>
            <label>
              Tipo:
              <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="ml-2 border px-2 py-1 rounded">
                <option value="todas">Todas</option>
                <option value="positivas">Positivas (≥ 4)</option>
                <option value="regulares">Regulares (= 3)</option>
                <option value="negativas">Negativas (≤ 2)</option>
              </select>
            </label>
          </div>

      {loading ? <p>Cargando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardResumenVendedor
            totalVentas={totalVentas}
            promedioPorCliente={promedioPorCliente}
            ventasActual={ventasActual}
            ventasPasadas={ventasPasadas}
            mesActual={mesActual}
            mesAnterior={mesAnterior}
            cambioPorcentaje={cambioPorcentaje}
            promedioResenas={promedioResenas}
            cantidadResenas={resenas.length}
          />

          {ranking && (
            <ResumenRanking
              ventasTotales={ranking.ventas_totales}
              montoTotal={ranking.monto_total}
              promedioCalificacion={ranking.promedio_calificacion}
              posicion={ranking.posicion}
            />
          )}

          <TopClientes
            topClientes={topClientes}
            totalVentasGlobal={totalVentas} // 💡 Esta es la prop nueva
          />

          <TopProductos
            productosMasVendidos={productosMasVendidos}
            totalProductosGlobal={totalProductosGlobal}
          />

          {sinPedidosRecientes && (
            <div className="col-span-1 md:col-span-2 bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-800">
              ⚠️ No has recibido pedidos en los últimos 7 días. Considerá hacer una promoción o revisar tu stock.
            </div>
          )}

          <ResenasRecientes resenas={resenas} filtro={filtro} setFiltro={setFiltro} />

        </div>
      )}
    </div>
  );
}