// 📁 pages/vendedor/perfil-vendedor/[id].tsx

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import TarjetaGlass from '@/components/TarjetaGlass';
import FondoAnimado from '@/components/FondoAnimado';
import ProductoCard from '@/components/ProductoCard';
import Estrellas from '@/components/Estrellas';
import InsigniasVendedor from '@/components/PerfilVendedor/InsigniasVendedor';
import MensajeRapidoForm from '@/components/PerfilVendedor/MensajeRapidoForm';
import ResumenCalificacion from '@/components/PerfilVendedor/ResumenCalificacion';
import ResumenMetricas from '@/components/PerfilVendedor/ResumenMetricas';
import BotonesVendedor from '@/components/PerfilVendedor/BotonesVendedor';
import PaginadorProductos from '@/components/PerfilVendedor/PaginadorProductos';
import ReseñasRecientes from '@/components/PerfilVendedor/ResenasRecientes';
import { toast } from 'react-hot-toast';
import { FaUserTie, FaUserTag } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
dayjs.locale('es');

interface Vendedor {
  id: number;
  nombreCompleto: string;
  nombreComercial?: string;
  rol: string;
  estado: string;
  fotoUrl?: string;
  productos?: any[];
  promedioCalificacion?: number;
  calificacionGlobal?: number;
}

interface Props {
  resenas: Resena[];
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (nuevaPagina: number) => void;
}

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  compradorId: number;
  createdAt: string;
  Comprador?: { nombreCompleto: string };
}

const PerfilVendedor = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user: userAuth } = useAuth();

  const [vendedor, setVendedor] = useState<Vendedor | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [orden, setOrden] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginaResenas, setPaginaResenas] = useState(1);
  const [verMasId, setVerMasId] = useState<number | null>(null);
  const [exportando, setExportando] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const productosPorPagina = 6;
  const resenasPorPagina = 5;

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`http://localhost:4000/api/vendedores/${id}`).then(res => res.json()),
      fetch(`http://localhost:4000/api/resenas/vendedor/${id}`).then(res => res.json())
    ])
      .then(([vendedorData, resenasData]) => {
        if (vendedorData.error) {
          toast.error(vendedorData.error);
        } else {
          setVendedor(vendedorData);
          setResenas(resenasData);
        }
      })
      .catch(() => toast.error('Error al cargar datos del vendedor'))
      .finally(() => setLoading(false));
  }, [id]);

  const enviarMensaje = async (mensaje: string) => {
    const res = await fetch('http://localhost:4000/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: mensaje, paraId: vendedor?.id })
    });

    if (res.ok) {
      toast.success('Mensaje enviado');
    } else {
      toast.error('Error al enviar mensaje');
    }
  };

  const exportarPerfilPDF = async () => {
    if (!pdfRef.current || exportando) return;
    setExportando(true);
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`perfil_vendedor_${id}.pdf`);
    setExportando(false);
  };

  if (loading) return <p className="text-center mt-8 text-gray-500">Cargando perfil del vendedor...</p>;
  if (!vendedor) return <p className="text-center mt-8 text-red-500">Vendedor no encontrado.</p>;

  const promedio = vendedor.promedioCalificacion || vendedor.calificacionGlobal || (resenas.length
    ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length
    : 0);

  const productosFiltrados = vendedor.productos
    ?.filter(p => (filtroCategoria === 'todos' || p.categoria === filtroCategoria) && p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (orden === 'precio_asc') return a.precio - b.precio;
      if (orden === 'precio_desc') return b.precio - a.precio;
      if (orden === 'calificacion_desc') return (b.promedioCalificacion || 0) - (a.promedioCalificacion || 0);
      return 0;
    });

  const totalPaginas = Math.ceil((productosFiltrados?.length || 0) / productosPorPagina);
  const productosPaginados = productosFiltrados?.slice((paginaActual - 1) * productosPorPagina, paginaActual * productosPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) setPaginaActual(nuevaPagina);
  };

  const reseñasOrdenadas = resenas
    .filter(r => r.comentario && r.comentario.length >= 3)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPaginasResenas = Math.ceil(reseñasOrdenadas.length / resenasPorPagina);
  const resenasPaginadas = reseñasOrdenadas.slice((paginaResenas - 1) * resenasPorPagina, paginaResenas * resenasPorPagina);

  const cambiarPaginaResenas = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginasResenas) setPaginaResenas(nuevaPagina);
  };

  const porcentajePositivas = resenas.length > 0
    ? (resenas.filter(r => r.calificacion >= 4).length / resenas.length) * 100
    : 0;

  const totalVentasSimulado = vendedor.productos?.reduce(
    (sum, p) => sum + (p.stockOriginal || 0) * p.precio,
    0
  ) || 0;

  const ventasPorMes: Record<string, number> = (vendedor.productos || []).reduce((acc, p) => {
    const mes = dayjs(p.createdAt || new Date()).format('YYYY-MM');
    const total = (p.stockOriginal || 0) * p.precio;
    acc[mes] = (acc[mes] || 0) + total;
    return acc;
  }, {});

  const mesActual = dayjs().format('YYYY-MM');
  const mesAnterior = dayjs().subtract(1, 'month').format('YYYY-MM');
  const gastoMesActual = ventasPorMes[mesActual] || 0;
  const gastoMesAnterior = ventasPorMes[mesAnterior] || 0;
  const variacionGasto = gastoMesAnterior
    ? ((gastoMesActual - gastoMesAnterior) / gastoMesAnterior) * 100
    : 0;

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-5xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">🧑‍💼 Perfil de {vendedor.nombreComercial || vendedor.nombreCompleto}</h1>
            <button
              onClick={exportarPerfilPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={exportando}
            >
              📄 {exportando ? 'Generando...' : 'Exportar a PDF'}
            </button>
          </div>

          <div ref={pdfRef}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={vendedor.fotoUrl || '/placeholder.jpg'}
                alt="Foto del vendedor"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-jade flex items-center gap-2">
                  {vendedor.nombreCompleto}
                  {vendedor.rol === 'vendedor' ? <FaUserTie className="text-xl text-gray-500" /> : <FaUserTag className="text-xl text-gray-500" />}
                </h2>
                <InsigniasVendedor promedio={promedio} cantidadProductos={vendedor.productos?.length || 0} cantidadResenas={resenas.length} />
                <p className="text-gray-600">
                  {vendedor.rol === 'vendedor' ? '🛍 Vendedor' : '🛒 Comprador'}
                  {vendedor.estado === 'aprobado' && (
                    <span className="ml-2 inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Aprobado</span>
                  )}
                </p>
                <p className="text-sm text-gray-700 mt-1">⭐ Promedio: {promedio.toFixed(2)} / 5</p>
                <p className="text-xs text-gray-500 mt-1">
                  {vendedor.productos?.length || 0} productos publicados · {resenas.length} reseñas recibidas
                </p>
              </div>
            </div>

            <ResumenCalificacion calificacion={promedio} />

          <ResumenMetricas
            metricas={[
              { titulo: '📊 % de reseñas positivas', valor: `${porcentajePositivas.toFixed(1)}%`, color: 'text-green-700' },
              { titulo: '💰 Ventas estimadas por stock', valor: `Q${totalVentasSimulado.toFixed(2)}`, color: 'text-blue-700' },
              { titulo: `📅 Gasto en ${mesActual}`, valor: `Q${gastoMesActual.toFixed(2)}`, color: 'text-indigo-700' },
              { titulo: `📅 Gasto en ${mesAnterior}`, valor: `Q${gastoMesAnterior.toFixed(2)}`, color: 'text-indigo-500' },
              {
                titulo: '📈 Variación mensual',
                valor: `${variacionGasto.toFixed(2)}%`,
                color: variacionGasto >= 0 ? 'text-green-700' : 'text-red-700',
              },
            ]}
          />

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Productos en venta</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  className="border rounded px-3 py-1 text-sm"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
                <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="border rounded px-3 py-1 text-sm">
                  <option value="todos">Todas</option>
                  <option value="corte">Corte</option>
                  <option value="traje_completo">Traje completo</option>
                  <option value="accesorio">Accesorio</option>
                  <option value="combo">Combo</option>
                </select>
                <select value={orden} onChange={e => setOrden(e.target.value)} className="border rounded px-3 py-1 text-sm">
                  <option value="">Predeterminado</option>
                  <option value="precio_asc">Precio: menor a mayor</option>
                  <option value="precio_desc">Precio: mayor a menor</option>
                  <option value="calificacion_desc">Calificación más alta</option>
                </select>
              </div>
              {productosPaginados?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {productosPaginados.map(producto => (
                    <ProductoCard key={producto.id} {...producto} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No se encontraron productos.</p>
              )}

              <PaginadorProductos
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={cambiarPagina}
              />
            </div>

            {/* Reseñas recientes */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reseñas recientes</h3>
              <ReseñasRecientes
                resenas={resenasPaginadas}
                paginaActual={paginaResenas}
                totalPaginas={totalPaginasResenas}
                cambiarPagina={cambiarPaginaResenas}
                verMasId={verMasId}
                setVerMasId={setVerMasId}
              />
            </div>

            {userAuth && userAuth.id !== vendedor.id && (
              <MensajeRapidoForm onSubmit={enviarMensaje} />
            )}
          </div>

          {userAuth && userAuth.id !== vendedor.id && (
            <BotonesVendedor vendedorId={vendedor.id} />
          )}
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default PerfilVendedor;