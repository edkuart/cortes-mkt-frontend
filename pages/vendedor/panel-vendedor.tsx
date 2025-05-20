// 📁 frontend/pages/vendedor/panel-vendedor.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PanelVendedor() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.rol !== 'vendedor') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [token, user, router]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👨‍💼 Panel del Vendedor</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Link href="/mis-productos" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📦 Mis Productos</h2>
            <p className="text-sm text-gray-500">Administra tus productos</p>
          </Link>
          <Link href="/estadisticas" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📊 Estadísticas</h2>
            <p className="text-sm text-gray-500">Revisa tu desempeño</p>
          </Link>
          <Link href="/devoluciones" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">↩️ Devoluciones</h2>
            <p className="text-sm text-gray-500">Gestiona solicitudes</p>
          </Link>
          <Link href="/resenas-producto/resumen" className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">⭐ Reseñas</h2>
            <p className="text-sm text-gray-500">Consulta lo que dicen de ti</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
