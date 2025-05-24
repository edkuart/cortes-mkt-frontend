// 📁 frontend/pages/vendedor/panel-vendedor.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Contadores {
  productos: number;
  pedidosPendientes: number;
  promedioCalificacion: number;
}

export default function PanelVendedor() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contadores, setContadores] = useState<Contadores>({ productos: 0, pedidosPendientes: 0, promedioCalificacion: 0 });

  useEffect(() => {
    if (!token || user?.rol !== 'vendedor') {
      router.push('/login');
    } else {
      setLoading(false);
      fetchContadores();
    }
  }, [token, user, router]);

  const fetchContadores = async () => {
    try {
      const [productosRes, pedidosRes, resenasRes] = await Promise.all([
        fetch(`http://localhost:4000/api/productos/vendedor/${user?.id}`),
        fetch(`http://localhost:4000/api/pedidos?vendedorId=${user?.id}`),
        fetch(`http://localhost:4000/api/resenas/vendedor/${user?.id}`),
      ]);

      const productosData = await productosRes.json();
      const pedidosData = await pedidosRes.json();
      const resenasData = await resenasRes.json();

      const pedidosPendientes = pedidosData.filter((p: any) => p.estadoTexto !== 'Entregado').length;
      const calificaciones = resenasData.map((r: any) => r.calificacion);
      const promedio = calificaciones.length ? (calificaciones.reduce((a: number, b: number) => a + b, 0) / calificaciones.length) : 0;

      setContadores({
        productos: productosData.length,
        pedidosPendientes,
        promedioCalificacion: Number(promedio.toFixed(2)),
      });
    } catch (error) {
      console.error('Error al cargar contadores:', error);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👨‍💼 Panel del Vendedor</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Link href="/mis-productos" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📦 Mis Productos</h2>
            <p className="text-sm text-gray-500">Administra tus productos</p>
            <p className="mt-2 text-lg font-bold text-blue-600">{contadores.productos}</p>
          </Link>
          <Link href="/dashboard-vendedor" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📊 Estadísticas</h2>
            <p className="text-sm text-gray-500">Revisa tu desempeño</p>
            <p className="mt-2 text-lg font-bold text-indigo-600">⭐ {contadores.promedioCalificacion}</p>
          </Link>
          <Link href="/vendedor/pedidos-vendedor" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📬 Pedidos</h2>
            <p className="text-sm text-gray-500">Gestiona tus pedidos recibidos</p>
            <p className="mt-2 text-lg font-bold text-amber-600">{contadores.pedidosPendientes}</p>
          </Link>
          <Link href="/vendedor/resumen-resenas" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">⭐ Reseñas</h2>
            <p className="text-sm text-gray-500">Consulta lo que dicen de ti</p>
            <p className="mt-2 text-lg font-bold text-yellow-600">{contadores.promedioCalificacion} / 5</p>
          </Link>
        </div>
      </div>
    </div>
  );
}