// 📁 frontend/components/Admin/Usuarios/TablaUsuarios.tsx

import { useState, useMemo } from 'react';
import {
  FaLock, FaUnlock, FaSearch, FaTimes, FaFileCsv, FaEye, FaBoxOpen, FaStar, FaCommentAlt
} from 'react-icons/fa';
import { Usuario } from '@/types/admin';
import { CSVLink } from 'react-csv';
import Modal from '@/components/Modal'; // Asume que este componente Modal existe y funciona

type PropsUsuarios = {
  usuarios: Usuario[]; 
  onToggleEstado: (id: number) => void;
};

const TablaUsuarios = ({ usuarios, onToggleEstado }: PropsUsuarios) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [usuarioSeleccionadoModal, setUsuarioSeleccionadoModal] = useState<Usuario | null>(null);

  const abrirModalDetalle = (usuario: Usuario) => {
    setUsuarioSeleccionadoModal(usuario);
  };

  const cerrarModalDetalle = () => {
    setUsuarioSeleccionadoModal(null);
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroRol('');
    setFiltroEstado('');
  };

  const usuariosFiltrados = useMemo(() => {
    let usuariosProcesados = Array.isArray(usuarios) ? [...usuarios] : [];
    if (terminoBusqueda) {
      const lowerTermino = terminoBusqueda.toLowerCase();
      usuariosProcesados = usuariosProcesados.filter(
        (usuario) =>
          (usuario.nombreCompleto || '').toLowerCase().includes(lowerTermino) ||
          (usuario.correo || '').toLowerCase().includes(lowerTermino)
      );
    }
    if (filtroRol) {
      usuariosProcesados = usuariosProcesados.filter((u) => u.rol === filtroRol);
    }
    if (filtroEstado) {
      usuariosProcesados = usuariosProcesados.filter((u) => u.estado === filtroEstado);
    }
    return usuariosProcesados;
  }, [usuarios, terminoBusqueda, filtroRol, filtroEstado]);

  const headersCSV = [
    { label: 'ID', key: 'id' },
    { label: 'Nombre Completo', key: 'nombreCompleto' },
    { label: 'Correo Electrónico', key: 'correo' },
    { label: 'Rol', key: 'rol' },
    { label: 'Estado', key: 'estado' },
    { label: 'Fecha de Registro', key: 'fechaRegistro' },
  ];

  const datosParaCSV = useMemo(() => {
    return usuariosFiltrados.map(usuario => ({
      id: usuario.id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      rol: usuario.rol,
      estado: usuario.estado,
      fechaRegistro: usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString() : 'N/A',
    }));
  }, [usuariosFiltrados]);

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <CSVLink
            data={datosParaCSV}
            headers={headersCSV}
            filename={"listado_usuarios.csv"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            target="_blank"
            asyncOnClick={true}
          >
            <FaFileCsv /> Exportar Usuarios (CSV)
          </CSVLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm">
            <option value="">Todos los Roles</option><option value="admin">Admin</option><option value="vendedor">Vendedor</option><option value="comprador">Comprador</option>
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm">
            <option value="">Todos los Estados</option><option value="activo">Activo</option><option value="bloqueado">Bloqueado</option>
          </select>
          <button onClick={limpiarFiltros} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
            <FaTimes /> Limpiar Filtros
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Mostrando {usuariosFiltrados.length} de {Array.isArray(usuarios) ? usuarios.length : 0} usuarios.
        </p>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Nombre Completo</th>
                <th className="px-5 py-3">Correo</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">{usuario.nombreCompleto}</td>
                    <td className="px-5 py-4 whitespace-nowrap"><span title={usuario.correo} className="truncate max-w-[150px] sm:max-w-[200px] block">{usuario.correo}</span></td>
                    <td className="px-5 py-4 whitespace-nowrap capitalize">{usuario.rol}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => abrirModalDetalle(usuario)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="Ver detalle del usuario"
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          onClick={() => onToggleEstado(usuario.id)}
                          className={`p-1.5 rounded-md text-white flex items-center justify-center gap-1 text-xs transition-colors shadow-sm
                            ${usuario.estado === 'activo' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'}
                            focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          title={usuario.estado === 'activo' ? 'Bloquear usuario' : 'Activar usuario'}
                        >
                          {usuario.estado === 'activo' ? <FaLock size={12} /> : <FaUnlock size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No se encontraron usuarios que coincidan con los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {usuarioSeleccionadoModal && (
        <Modal onClose={cerrarModalDetalle}>
          <div className="p-2 sm:p-4 max-w-lg w-full">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
              Detalle del Usuario: <span className="text-blue-600">{usuarioSeleccionadoModal.nombreCompleto}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 mb-6 max-h-[60vh] overflow-y-auto pr-2">
              <p><strong>ID:</strong> {usuarioSeleccionadoModal.id}</p>
              <p><strong>Correo:</strong> {usuarioSeleccionadoModal.correo}</p>
              <p><strong>Rol:</strong> <span className="capitalize font-medium">{usuarioSeleccionadoModal.rol}</span></p>
              <p><strong>Estado:</strong>
                <span className={`ml-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${usuarioSeleccionadoModal.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {usuarioSeleccionadoModal.estado}
                </span>
              </p>
              {usuarioSeleccionadoModal.createdAt && (
                <p><strong>Fecha de Registro:</strong> {new Date(usuarioSeleccionadoModal.createdAt).toLocaleString()}</p>
              )}
            </div>

            {usuarioSeleccionadoModal.rol === 'vendedor' && (
              <div className="mb-6 border-t pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Estadísticas del Vendedor:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg text-center shadow">
                    <FaBoxOpen className="mx-auto text-blue-500 mb-1" size={20}/>
                    <p className="font-semibold text-lg">{usuarioSeleccionadoModal.totalProductos ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500">Productos</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center shadow">
                    <FaStar className="mx-auto text-yellow-500 mb-1" size={20}/>
                    <p className="font-semibold text-lg">{usuarioSeleccionadoModal.promedioCalificacion?.toFixed(1) ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500">Calificación</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center shadow">
                    <FaCommentAlt className="mx-auto text-green-500 mb-1" size={20}/>
                    <p className="font-semibold text-lg">{usuarioSeleccionadoModal.totalResenas ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500">Reseñas</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 border-t pt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row-reverse sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  onToggleEstado(usuarioSeleccionadoModal.id);
                  // Considera cerrar el modal aquí si la acción es definitiva o si onToggleEstado
                  // no actualiza inmediatamente el objeto usuarioSeleccionadoModal.
                  // cerrarModalDetalle(); 
                }}
                className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm
                  ${usuarioSeleccionadoModal.estado === 'activo' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
              >
                {usuarioSeleccionadoModal.estado === 'activo' ? 'Bloquear Usuario' : 'Activar Usuario'}
              </button>
              <button
                type="button"
                disabled 
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              >
                Ver Pedidos (Próximamente)
              </button>
              <button
                type="button"
                onClick={cerrarModalDetalle}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TablaUsuarios;