// 📁 pages/productos/historial/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import Link from 'next/link';

interface Cambio {
  id: number;
  productoId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  imagenAnterior?: string;
  imagenNueva?: string;
  usuario?: string;
  createdAt: string;
}

export default function HistorialProductoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cambios, setCambios] = useState<Cambio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/api/historial/${id}`)
        .then(res => res.json())
        .then(data => setCambios(data))
        .catch(() => toast.error('Error al cargar historial'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Historial de Cambios del Producto #{id}</h1>

      <div className="mb-6 flex justify-between items-center">
        <Link href="/vendedor/panel-vendedor" className="text-sm text-blue-600 hover:underline">
          ← Volver al panel del vendedor
        </Link>
        <Link href="/comprador/perfil-comprador" className="text-sm text-green-600 hover:underline">
          👤 Ir a perfil del comprador
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando historial...</p>
      ) : cambios.length === 0 ? (
        <p className="text-gray-500">Este producto no tiene cambios registrados.</p>
      ) : (
        <ul className="space-y-4">
          {cambios.map((cambio) => (
            <li
              key={cambio.id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <p className="text-sm text-gray-700">
                <strong>Cambio:</strong> <span className="text-blue-700">{cambio.campo}</span>
              </p>
              <p className="text-sm">
                <span className="text-red-600 line-through">{cambio.valorAnterior}</span> →{' '}
                <span className="text-green-600 font-semibold">{cambio.valorNuevo}</span>
              </p>
              {cambio.imagenAnterior || cambio.imagenNueva ? (
                <div className="flex gap-4 mt-2">
                  {cambio.imagenAnterior && (
                    <div>
                      <p className="text-xs text-gray-500">Antes:</p>
                      <img src={cambio.imagenAnterior} alt="Imagen anterior" className="w-20 h-20 rounded border" />
                    </div>
                  )}
                  {cambio.imagenNueva && (
                    <div>
                      <p className="text-xs text-gray-500">Después:</p>
                      <img src={cambio.imagenNueva} alt="Imagen nueva" className="w-20 h-20 rounded border" />
                    </div>
                  )}
                </div>
              ) : null}
              {cambio.usuario && (
                <p className="text-xs text-gray-500 mt-1">Modificado por: {cambio.usuario}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {dayjs(cambio.createdAt).format('DD/MM/YYYY HH:mm')}hs
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}