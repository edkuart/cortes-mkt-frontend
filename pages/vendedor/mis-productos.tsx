// 📁 pages/vendedor/mis-productos.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProductoCard from '@/components/ProductoCard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl?: string;
  descripcion: string;
  vendedorId: number;
}

export default function MisProductosPage() {
  const { user, isAuthenticated } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || user?.rol !== 'vendedor') return;

    fetch(`http://localhost:4000/api/productos?vendedorId=${user.id}`)
      .then(res => res.json())
      .then(setProductos)
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setCargando(false));
  }, [user]);

  const handleEditar = (id: number) => {
    router.push(`/productos/editar/${id}`);
  };

  const handleEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmacion) return;

    try {
      const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      toast.success('Producto eliminado correctamente');
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('No se pudo eliminar el producto');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Mis Productos</h1>
        <Link href="/productos/crear" className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700">
          ➕ Nuevo Producto
        </Link>
      </div>

      {cargando ? (
        <p className="text-gray-600">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-gray-500">No has registrado productos aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} {...producto} onEditar={handleEditar} onEliminar={handleEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}