// 📁 pages/comprador/perfil-comprador.tsx
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { obtenerPedidosComprador, obtenerResenasComprador } from '@/services/actividadService';

interface Pedido {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
  detalles?: {
    producto: {
      id: number;
      nombre: string;
    };
    cantidad: number;
  }[];
}

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  Producto?: {
    id: number;
    nombre: string;
  };
}

export default function PerfilCompradorPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [filtro, setFiltro] = useState<string>(() => {
    return localStorage.getItem('filtroResenas') || 'todas';
  });
  const [tab, setTab] = useState<'pedidos' | 'resenas'>('pedidos');
  const seccionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || user.rol !== 'comprador') {
      toast.error('Acceso no autorizado');
      setTimeout(() => router.push('/'), 1500);
      return;
    }

    obtenerPedidosComprador(user.id)
      .then(setPedidos)
      .catch(() => toast.error('Error al cargar pedidos'));

    obtenerResenasComprador(user.id)
      .then(setResenas)
      .catch(() => toast.error('Error al cargar reseñas'));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('filtroResenas', filtro);
  }, [filtro]);

  const totalGastado = pedidos.reduce((sum, p) => sum + p.total, 0);
  const ultimoPedido = pedidos.length > 0 ? pedidos[pedidos.length - 1] : null;
  const hayPedidoPendiente = pedidos.some(p => p.estado.toLowerCase() === 'pendiente');

  const resenasFiltradas = resenas.filter(r => {
    if (filtro === 'positivas') return r.calificacion >= 4;
    if (filtro === 'regulares') return r.calificacion === 3;
    if (filtro === 'negativas') return r.calificacion <= 2;
    return true;
  });

  const exportarPDF = async () => {
    if (!seccionRef.current || !user) return;
    const canvas = await html2canvas(seccionRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');
    pdf.setFontSize(10);
    pdf.text(`Usuario: ${user.nombre}`, 10, 10);
    pdf.text(`Correo: ${user.correo}`, 10, 15);
    pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
    pdf.save(`actividad-comprador_${timestamp}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">👤 Mi Actividad como Comprador</h1>
      {user && (
        <p className="text-sm text-gray-600 mb-4">Bienvenido, <span className="font-semibold">{user.nombre}</span></p>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('pedidos')}
          className={`px-4 py-2 rounded ${tab === 'pedidos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          📦 Pedidos
        </button>
        <button
          onClick={() => setTab('resenas')}
          className={`px-4 py-2 rounded ${tab === 'resenas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          ✍️ Reseñas
        </button>
        <button
          onClick={exportarPDF}
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📄 Descargar PDF
        </button>
      </div>

      <div ref={seccionRef}>
        {tab === 'pedidos' && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">📦 Mis Pedidos <span className="text-sm text-gray-500">({pedidos.length})</span></h2>
            <p className="text-sm text-gray-600 mb-2">📟 Total gastado: Q{totalGastado.toFixed(2)}</p>
            {hayPedidoPendiente && (
              <p className="text-sm text-yellow-600 mb-2">⚠️ Tienes pedidos pendientes por completar.</p>
            )}
            {ultimoPedido && (
              <p className="text-sm text-gray-700 mb-4">
                🕒 Último pedido realizado el {dayjs(ultimoPedido.createdAt).format('DD/MM/YYYY HH:mm')} - Estado: <span className="font-semibold">{ultimoPedido.estado}</span>
              </p>
            )}
            {pedidos.length === 0 ? (
              <p className="text-gray-500">No has realizado pedidos aún.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pedidos.map((p) => (
                  <li key={p.id} className="py-2">
                    <p className="font-medium">Pedido #{p.id} - Q{p.total.toFixed(2)}</p>
                    <p className="text-sm">
                      Estado: <span className={`px-2 py-0.5 text-xs rounded-full ${
                        p.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        p.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>{p.estado}</span>
                    </p>
                    <p className="text-xs text-gray-400 mb-1">{dayjs(p.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    {p.detalles && p.detalles.length > 0 && (
                      <ul className="pl-4 list-disc text-sm text-gray-700">
                        {p.detalles.map((d, idx) => (
                          <li key={idx}>
                            <Link href={`/resenas-producto/${d.producto.id}`} className="text-blue-600 hover:underline">
                              {d.producto.nombre}
                            </Link> - Cantidad: {d.cantidad}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'resenas' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">✍️ Mis Reseñas <span className="text-sm text-gray-500">({resenas.length})</span></h2>
            <div className="mb-3">
              <label htmlFor="filtro" className="text-sm text-gray-600 mr-2">Filtrar:</label>
              <select
                id="filtro"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="todas">Todas</option>
                <option value="positivas">Positivas</option>
                <option value="regulares">Regulares</option>
                <option value="negativas">Negativas</option>
              </select>
            </div>
            {resenasFiltradas.length === 0 ? (
              <p className="text-gray-500">No hay reseñas para este filtro.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {resenasFiltradas.map((r) => (
                  <li key={r.id} className="py-2">
                    <p className="font-medium text-yellow-700">⭐ {r.calificacion}</p>
                    {r.Producto && (
                      <p className="text-sm font-medium">
                        Producto: <Link href={`/resenas-producto/${r.Producto.id}`} className="text-blue-600 hover:underline">
                          {r.Producto.nombre}
                        </Link>
                      </p>
                    )}
                    <p className="text-sm italic">"{r.comentario}"</p>
                    <p className="text-xs text-gray-400">{dayjs(r.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      <div className="mt-6">
        <Link href="/perfil" className="text-sm text-blue-600 hover:underline">
          ← Volver a perfil general
        </Link>
      </div>
    </div>
  );
}