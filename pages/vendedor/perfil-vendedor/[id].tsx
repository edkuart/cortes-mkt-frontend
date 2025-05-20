// 📁 pages/vendedor/perfil-vendedor/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TarjetaGlass from '@/components/TarjetaGlass';
import FondoAnimado from '@/components/FondoAnimado';
import ProductoCard from '@/components/ProductoCard';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { FaUserTie, FaUserTag } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Vendedor {
  id: number;
  nombreCompleto: string;
  rol: string;
  estado: string;
  fotoUrl?: string;
  productos?: any[];
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
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/api/vendedores/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            toast.error(data.error);
          } else {
            setVendedor(data);
          }
        })
        .catch(() => toast.error('No se pudo cargar el perfil del vendedor'));

      fetch(`http://localhost:4000/api/resenas/vendedor/${id}`)
        .then(res => res.json())
        .then(data => setResenas(data))
        .catch(() => toast.error('No se pudieron cargar las reseñas'));
    }
  }, [id]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    const res = await fetch('http://localhost:4000/api/mensajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contenido,
        paraId: vendedor?.id,
      }),
    });

    if (res.ok) {
      toast.success('Mensaje enviado');
      setContenido('');
    } else {
      toast.error('Error al enviar mensaje');
    }
  };

  if (!vendedor) return null;

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-3xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={vendedor.fotoUrl || '/placeholder.jpg'}
              alt="Foto del vendedor"
              className="w-32 h-32 rounded-full object-cover border"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-jade flex items-center gap-2">
                {vendedor.nombreCompleto}
                {vendedor.rol === 'vendedor' ? <FaUserTie className="text-xl text-gray-500" /> : <FaUserTag className="text-xl text-gray-500" />}
              </h2>
              <p className="text-gray-600">
                {vendedor.rol === 'vendedor' ? '🛍 Vendedor' : '🛒 Comprador'}
                {vendedor.estado === 'aprobado' && (
                  <span className="ml-2 inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                    Aprobado
                  </span>
                )}
              </p>
              <p className="text-gray-500 text-sm mt-1">ID: {vendedor.id}</p>
            </div>
          </div>

          {/* Zona de acciones */}
          {userAuth && userAuth.id !== vendedor.id && (
            <div className="mt-6 flex flex-col gap-4">
              <form onSubmit={enviarMensaje} className="space-y-4">
                <label className="block text-sm font-bold mb-1">Mensaje rápido</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  rows={4}
                />
                <button
                  type="submit"
                  className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Enviar mensaje
                </button>
              </form>

              <Link href={`/mensajes/${vendedor.id}`}>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
                >
                  💬 Ir al chat con este vendedor
                </button>
              </Link>

              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                🚫 Reportar perfil
              </button>
            </div>
          )}

          {/* Productos */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Productos disponibles</h3>
            {vendedor.productos?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vendedor.productos.map(producto => (
                  <ProductoCard key={producto.id} {...producto} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Este vendedor aún no ha publicado productos.</p>
            )}
          </div>

          {/* Reseñas */}
          {resenas.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reseñas del vendedor</h3>
              <ul className="space-y-3">
                {resenas.slice(0, 5).map((r) => (
                  <li key={r.id} className="border-b pb-2">
                    <p className="text-sm text-gray-700">⭐ {r.calificacion} - "{r.comentario}"</p>
                    <p className="text-xs text-gray-500">{r.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(r.createdAt).format('DD/MM/YYYY')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default PerfilVendedor;