// 📁 pages/productos/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProductoVista from '@/components/ProductoVista';
import Head from 'next/head';

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

      <div className="max-w-4xl mx-auto p-6">
        <ProductoVista producto={producto} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Vendedor: <span className="font-semibold text-blue-700">{vendedorNombre}</span>
          </p>
          <button
            onClick={() => router.push(`/mensajes/${producto.vendedorId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            💬 Contactar al vendedor
          </button>
        </div>
      </div>
    </>
  );
}