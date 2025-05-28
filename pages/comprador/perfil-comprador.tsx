// 📁 pages/comprador/perfil-comprador.tsx

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { obtenerPedidosComprador, obtenerResenasComprador } from '@/services/actividadService';
import exportarPDFDesdeSeccion from '@/utils/pdfExport';
import usePedidosResumen from '@/hooks/usePedidosResumen';

import TabsActividad from '@/components/PerfilComprador/TabsActividad';
import ListaPedidos from '@/components/PerfilComprador/ListaPedidos';
import FiltroResenas from '@/components/PerfilComprador/FiltroResenas';
import ListaResenas from '@/components/PerfilComprador/ListaResenas';
import TopCompras from '@/components/PerfilComprador/TopCompras';
import RecomendadosPorCategoria from '@/components/PerfilComprador/RecomendadosPorCategoria';
import ProgresoComprador from '@/components/PerfilComprador/ProgresoComprador';
import InsigniasComprador from '@/components/PerfilComprador/InsigniasComprador';
import FavoritosComprador from '@/components/PerfilComprador/FavoritosComprador';

type TipoFiltro = 'todas' | 'positivas' | 'regulares' | 'negativas';

interface Pedido {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
  detalles?: {
    producto: {
      id: number;
      nombre: string;
      categoria?: string;
    };
    cantidad: number;
  }[];
}

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  respuestaVendedor?: string;
  Comprador?: {
    nombreCompleto: string;
  };
  Producto?: {
    id: number;
    nombre: string;
  };
}

export default function PerfilCompradorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [filtro, setFiltro] = useState<TipoFiltro>('todas');
  const [tab, setTab] = useState<'pedidos' | 'resenas'>('pedidos');
  const seccionRef = useRef(null);
  const [categoriaFrecuente, setCategoriaFrecuente] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.rol !== 'comprador') {
      toast.error('Acceso no autorizado');
      setTimeout(() => router.push('/'), 1500);
      return;
    }
    obtenerPedidosComprador(user.id).then(setPedidos).catch(() => toast.error('Error al cargar pedidos'));
    obtenerResenasComprador(user.id).then(setResenas).catch(() => toast.error('Error al cargar reseñas'));
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('filtroResenas');
      if (
        guardado === 'positivas' ||
        guardado === 'negativas' ||
        guardado === 'regulares' ||
        guardado === 'todas'
      ) {
        setFiltro(guardado as TipoFiltro);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('filtroResenas', filtro);
    }
  }, [filtro]);

  useEffect(() => {
    const conteo: Record<string, number> = {};
    for (const pedido of pedidos) {
      if (!pedido.detalles) continue;
      for (const d of pedido.detalles) {
        const cat = d.producto.categoria || 'otro';
        conteo[cat] = (conteo[cat] || 0) + d.cantidad;
      }
    }
    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
    setCategoriaFrecuente(top ? top[0] : null);
  }, [pedidos]);

  const { totalGastado, ultimoPedido, hayPedidoPendiente } = usePedidosResumen(pedidos);
  const resenasFiltradas = resenas.filter(r => {
    if (filtro === 'positivas') return r.calificacion >= 4;
    if (filtro === 'regulares') return r.calificacion === 3;
    if (filtro === 'negativas') return r.calificacion <= 2;
    return true;
  });

  const actualizarRespuesta = (id: number, respuesta: string) => {
    setResenas(prev => prev.map(r => r.id === id ? { ...r, respuestaVendedor: respuesta } : r));
    toast.success('✅ Respuesta guardada correctamente');
  };

  const exportarPDF = async () => {
    if (!user) return;
    await exportarPDFDesdeSeccion(seccionRef.current, user, 'actividad-comprador');
  };

  const topCompras = (() => {
    const conteo: Record<string, { nombre: string; cantidad: number; total: number }> = {};
    for (const pedido of pedidos) {
      if (!pedido.detalles) continue;
      for (const d of pedido.detalles) {
        const clave = d.producto.id.toString();
        if (!conteo[clave]) {
          conteo[clave] = { nombre: d.producto.nombre, cantidad: 0, total: 0 };
        }
        conteo[clave].cantidad += d.cantidad;
        conteo[clave].total += d.cantidad * (pedido.total / pedido.detalles.length);
      }
    }
    return Object.entries(conteo)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);
  })();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">👤 Mi Actividad como Comprador</h1>
      {user && (
        <p className="text-sm text-gray-600 mb-4">
          Bienvenido, <span className="font-semibold">{user.nombre}</span>
        </p>
      )}

      <TabsActividad tab={tab} setTab={setTab} exportarPDF={exportarPDF} />

      <div ref={seccionRef}>
        {tab === 'pedidos' && (
          <>
            <InsigniasComprador pedidos={pedidos} resenas={resenas} />
            <ProgresoComprador totalPedidos={pedidos.length} />
            <TopCompras productos={topCompras} />
            <FavoritosComprador />
            <RecomendadosPorCategoria categoria={categoriaFrecuente} />
            <ListaPedidos pedidos={pedidos} totalGastado={totalGastado} ultimoPedido={ultimoPedido} hayPedidoPendiente={hayPedidoPendiente} />
          </>
        )}

        {tab === 'resenas' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">✍️ Mis Reseñas <span className="text-sm text-gray-500">({resenas.length})</span></h2>
            <FiltroResenas filtro={filtro} setFiltro={setFiltro} />
            <ListaResenas resenas={resenasFiltradas} actualizarRespuesta={actualizarRespuesta} />
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