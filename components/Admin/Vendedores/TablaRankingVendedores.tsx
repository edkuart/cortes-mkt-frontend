// 📁 frontend/components/Admin/Vendedores/TablaRankingVendedores.tsx

import Link from 'next/link';
import { VendedorDetalle } from '@/types/admin'; // Usa el tipo específico que definiste
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Para obtener el token si la API está protegida
import toast from 'react-hot-toast';
import { FaSpinner, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';

// No es necesario exportar el componente si se usa por defecto
const TablaRankingVendedores = () => {
  const [vendedores, setVendedores] = useState<VendedorDetalle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Obtener token para la petición

  const fetchVendedoresRanking = useCallback(async () => {
    if (!token) { // No hacer fetch si no hay token (si la ruta está protegida)
      // Opcionalmente, podrías no proteger esta ruta si el ranking es público para admins
      // setError("Autenticación requerida para ver el ranking.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/ranking-vendedores', {
        headers: {
          'Authorization': `Bearer ${token}`, // Añadir token si la API lo requiere
        },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor al obtener ranking.' }));
        throw new Error(errorData.message || 'No se pudo obtener el ranking de vendedores');
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setVendedores(data);
      } else {
        console.error("Datos del ranking no son un array:", data);
        throw new Error("Formato de datos incorrecto para el ranking.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error al obtener ranking de vendedores:', errorMessage);
      setError(errorMessage);
      toast.error(`Error al cargar ranking: ${errorMessage}`);
      setVendedores([]); // Limpiar vendedores en caso de error
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Depender del token

  useEffect(() => {
    fetchVendedoresRanking();
  }, [fetchVendedoresRanking]); // Usar la función memoizada

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🏆 Ranking de Vendedores</h2>
      
      {isLoading && (
        <div className="text-center py-10">
          <FaSpinner className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
          <p className="text-gray-500">Cargando ranking...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">
          <FaExclamationTriangle className="mx-auto mb-2" size={24} />
          <p className="font-semibold">Error al cargar el ranking:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Nombre del Vendedor</th>
                <th className="px-5 py-3 text-center">⭐ Promedio</th>
                <th className="px-5 py-3 text-center">📝 Reseñas</th>
                <th className="px-5 py-3 text-center">📦 Productos</th>
                <th className="px-5 py-3 text-center">🚨 Reportes Recibidos</th>
                <th className="px-5 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
              {vendedores.length > 0 ? (
                vendedores.map((vendedor, index) => (
                  <tr key={vendedor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-500">{index + 1}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-900">{vendedor.nombre}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span className="font-medium text-yellow-600">
                        {vendedor.promedioCalificacion !== null && vendedor.promedioCalificacion !== undefined 
                          ? vendedor.promedioCalificacion.toFixed(1) 
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">{vendedor.totalResenas ?? 'N/A'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">{vendedor.totalProductos ?? 'N/A'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center text-red-500 font-medium">{vendedor.totalReportes ?? 'N/A'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <Link
                        href={`/admin/vendedores/${vendedor.id}`} // Asumiendo una ruta de detalle de vendedor para admin
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver Perfil <FaExternalLinkAlt size={10}/>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    No hay datos de ranking de vendedores disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaRankingVendedores; // Exportar por defecto