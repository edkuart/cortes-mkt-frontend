// 📁 pages/productos/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import ProductoVista from '@/components/ProductoVista';
import Head from 'next/head';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AgregarAFavoritos from '@/components/Producto/AgregarAFavoritos';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  promedioCalificacion: number;
  vendedorId: number;
  vendedorNombre?: string;
  insignias?: string[];
  reseñas: {
    id: number;
    comentario: string;
    calificacion: number;
    comprador: {
      nombreCompleto: string;
    };
  }[];
}

export default function ProductoPublicoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [vendedorNombre, setVendedorNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'positivas' | 'neutras' | 'negativas'>('todas');
  const pdfRef = useRef<HTMLDivElement>(null);
  const usuario = { id: 1 }; // 🔐 Simulado

  useEffect(() => {
    if (!router.isReady || !id) return;

    fetch(`http://localhost:4000/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        if (data?.vendedorId) {
          fetch(`http://localhost:4000/api/vendedores/${data.vendedorId}`)
            .then(res => res.json())
            .then(v => setVendedorNombre(v.nombreCompleto))
            .catch(() => setVendedorNombre('Vendedor'));
        }
      })
      .catch(() => toast.error('Error al cargar el producto'))
      .finally(() => setLoading(false));
  }, [router.isReady, id]);

  const descargarResenasPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`reseñas_producto_${producto?.id}.pdf`);
  };

  const reseñasFiltradas = producto?.reseñas.filter(r => {
    if (filtro === 'positivas') return r.calificacion >= 4;
    if (filtro === 'neutras') return r.calificacion === 3;
    if (filtro === 'negativas') return r.calificacion <= 2;
    return true;
  }) || [];

  const resumenCalificaciones = [1, 2, 3, 4, 5].map(num => ({
    calificacion: `${num} estrellas`,
    cantidad: producto?.reseñas.filter(r => r.calificacion === num).length || 0
  }));

  if (loading) return <p className="text-center mt-8 text-gray-500">Cargando producto...</p>;
  if (!producto) return <p className="text-center mt-8 text-red-500">Producto no encontrado.</p>;

  return (
    <>
      <Head>
        <title>{producto.nombre} | Marketplace</title>
        <meta name="description" content={producto.descripcion.slice(0, 150)} />
        <meta property="og:title" content={producto.nombre} />
        <meta property="og:description" content={producto.descripcion.slice(0, 150)} />
        <meta property="og:image" content={producto.imagen} />
      </Head>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <nav className="text-sm text-gray-600">
          <Link href="/">Inicio</Link> / <Link href="/productos">Productos</Link> / <span className="text-gray-800 font-semibold">{producto.nombre}</span>
        </nav>

        <ProductoVista producto={producto} />

        <AgregarAFavoritos productoId={producto.id} usuarioId={usuario.id} />

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={descargarResenasPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            📄 Exportar reseñas a PDF
          </button>
          <Link href={`/mensajes/${producto.vendedorId}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            💬 Contactar al vendedor
          </Link>
          <Link href={`/productos/historial/${producto.id}`} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
            📜 Ver historial del producto
          </Link>
          <Link href={`/vendedor/perfil-vendedor/${producto.vendedorId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            🧑‍💼 Ver perfil del vendedor
          </Link>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">📊 Resumen de calificaciones</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={resumenCalificaciones}>
              <XAxis dataKey="calificacion" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-3 items-center text-sm">
          <span>🔎 Filtrar reseñas:</span>
          <button onClick={() => setFiltro('todas')} className={filtro === 'todas' ? 'font-bold underline' : ''}>Todas</button>
          <button onClick={() => setFiltro('positivas')} className={filtro === 'positivas' ? 'font-bold underline text-green-600' : ''}>Positivas (≥4)</button>
          <button onClick={() => setFiltro('neutras')} className={filtro === 'neutras' ? 'font-bold underline text-yellow-600' : ''}>Neutras (=3)</button>
          <button onClick={() => setFiltro('negativas')} className={filtro === 'negativas' ? 'font-bold underline text-red-500' : ''}>Negativas (≤2)</button>
        </div>

        <div ref={pdfRef} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">📝 Reseñas del producto</h2>
          {reseñasFiltradas.length === 0 ? (
            <p className="text-gray-500">Este producto aún no tiene reseñas en esta categoría.</p>
          ) : (
            <ul className="space-y-4">
              {reseñasFiltradas.map(reseña => (
                <li key={reseña.id} className="border rounded-lg p-4 bg-gray-50 shadow">
                  <p className="text-sm font-semibold text-blue-800">{reseña.comprador.nombreCompleto}</p>
                  <p className="text-sm">{reseña.comentario}</p>
                  <p className="text-xs text-yellow-600">⭐ {reseña.calificacion} / 5</p>
                  <button className="text-xs text-red-500 hover:underline">🚩 Reportar reseña</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}