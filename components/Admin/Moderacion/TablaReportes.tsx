// 📁 components/Admin/Moderacion/TablaReportes.tsx

import { useEffect, useState, useMemo } from 'react';
import { FaCheck, FaEye, FaTrash, FaFileExport, FaSort, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/Modal';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';

interface Reporte {
  id: number;
  tipo: 'producto' | 'resena' | 'mensaje';
  motivo: string;
  contenidoId: number;
  descripcion?: string;
  estado: 'pendiente' | 'resuelto';
  createdAt: string;
  usuario: {
    nombreCompleto: string;
    correo: string;
  };
}

type ReporteSortableKeys = keyof Reporte | 'usuario.correo';

const TablaReportes = () => {
  const { token } = useAuth();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [modalDetalle, setModalDetalle] = useState<Reporte | null>(null);
  const [indiceModalActual, setIndiceModalActual] = useState<number | null>(null);
  const [configOrden, setConfigOrden] = useState<{ key: ReporteSortableKeys; direccion: 'asc' | 'desc'; } | null>({ key: 'createdAt', direccion: 'desc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarReportes = async () => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:4000/api/reportes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        setReportes(Array.isArray(data) ? data : data.reportes || []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        toast.error(`Error al cargar reportes: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    };
    cargarReportes();
  }, [token]);

  const reportesFiltrados = useMemo(() => {
    let r = [...reportes];
    if (filtroTipo) r = r.filter(rep => rep.tipo === filtroTipo);
    if (filtroEstado) r = r.filter(rep => rep.estado === filtroEstado);
    if (terminoBusqueda) {
      const term = terminoBusqueda.toLowerCase();
      r = r.filter(rep =>
        rep.motivo.toLowerCase().includes(term) ||
        rep.usuario?.correo.toLowerCase().includes(term)
      );
    }
    return r;
  }, [reportes, filtroTipo, filtroEstado, terminoBusqueda]);

  const reportesOrdenados = useMemo(() => {
    let items = [...reportesFiltrados];
    if (configOrden !== null) {
      items.sort((a, b) => {
        let valA: any = a[configOrden.key as keyof Reporte];
        let valB: any = b[configOrden.key as keyof Reporte];
        if (configOrden.key === 'usuario.correo') {
          valA = a.usuario?.correo;
          valB = b.usuario?.correo;
        }
        if (configOrden.key === 'createdAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return configOrden.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return configOrden.direccion === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [reportesFiltrados, configOrden]);

  const solicitarOrden = (key: ReporteSortableKeys) => {
    let direccion: 'asc' | 'desc' = 'asc';
    if (configOrden && configOrden.key === key && configOrden.direccion === 'asc') {
      direccion = 'desc';
    }
    setConfigOrden({ key, direccion });
  };

  const resolverReporte = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reportes/${id}/resolver`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al resolver');
      toast.success('✅ Reporte resuelto');
      setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: 'resuelto' } : r));
    } catch (e) {
      toast.error('❌ No se pudo resolver');
    }
  };

  const eliminarReporte = async (id: number) => {
    if (!confirm('¿Seguro que querés eliminar este reporte?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reportes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('🗑 Reporte eliminado');
      setReportes(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      toast.error('❌ No se pudo eliminar');
    }
  };

  const abrirModal = (r: Reporte) => {
    const i = reportesOrdenados.findIndex(rep => rep.id === r.id);
    setIndiceModalActual(i);
    setModalDetalle(r);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Reportes de Usuarios ({reportesOrdenados.length})</h2>
        <CSVLink
          data={reportesOrdenados.map(r => ({ ...r, 'usuario.correo': r.usuario.correo }))}
          headers={[{ label: 'ID', key: 'id' }, { label: 'Tipo', key: 'tipo' }, { label: 'Motivo', key: 'motivo' }, { label: 'Correo', key: 'usuario.correo' }, { label: 'Estado', key: 'estado' }]}
          filename={'reportes.csv'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          <FaFileExport /> Exportar CSV
        </CSVLink>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Buscar por correo o motivo..." value={terminoBusqueda} onChange={e => setTerminoBusqueda(e.target.value)} className="border px-3 py-1 rounded w-full sm:w-64" />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="border px-3 py-1 rounded">
          <option value="">Todos los tipos</option>
          <option value="producto">Producto</option>
          <option value="resena">Reseña</option>
          <option value="mensaje">Mensaje</option>
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="border px-3 py-1 rounded">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando reportes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                <th className="px-4 py-2 cursor-pointer" onClick={() => solicitarOrden('tipo')}>Tipo <FaSort className="inline ml-1" /></th>
                <th className="px-4 py-2">Motivo</th>
                <th className="px-4 py-2">ID Objetivo</th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => solicitarOrden('usuario.correo')}>Usuario <FaSort className="inline ml-1" /></th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => solicitarOrden('createdAt')}>Fecha <FaSort className="inline ml-1" /></th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {reportesOrdenados.map(reporte => (
                <tr key={reporte.id}>
                  <td className="px-4 py-2 capitalize">{reporte.tipo}</td>
                  <td className="px-4 py-2">{reporte.motivo}</td>
                  <td className="px-4 py-2">#{reporte.contenidoId}</td>
                  <td className="px-4 py-2">{reporte.usuario?.correo}</td>
                  <td className="px-4 py-2">{new Date(reporte.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reporte.estado === 'resuelto' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {reporte.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => abrirModal(reporte)} className="text-blue-500 hover:text-blue-600"><FaEye /></button>
                    {reporte.estado === 'pendiente' && (
                      <button onClick={() => resolverReporte(reporte.id)} className="text-green-600 hover:text-green-700"><FaCheck /></button>
                    )}
                    <button onClick={() => eliminarReporte(reporte.id)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalDetalle && (
        <Modal onClose={() => { setModalDetalle(null); setIndiceModalActual(null); }}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Detalle del Reporte #{modalDetalle.id}</h3>
            <p><strong>Tipo:</strong> {modalDetalle.tipo}</p>
            <p><strong>Motivo:</strong> {modalDetalle.motivo}</p>
            <p><strong>Descripción:</strong> {modalDetalle.descripcion || 'Sin descripción'}</p>
            <p><strong>Correo del Usuario:</strong> {modalDetalle.usuario.correo}</p>
            <p><strong>Fecha:</strong> {new Date(modalDetalle.createdAt).toLocaleString()}</p>
            <p><strong>Estado:</strong> {modalDetalle.estado}</p>
            <button onClick={() => setModalDetalle(null)} className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cerrar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TablaReportes;
