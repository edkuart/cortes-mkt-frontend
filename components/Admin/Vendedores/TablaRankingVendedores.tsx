// 📁 frontend/components/Admin/Usuarios/TablaUsuarios.tsx

import { useState, useMemo } from 'react';
import { FaLock, FaUnlock, FaSearch, FaTimes, FaFileCsv, FaExternalLinkAlt } from 'react-icons/fa';
import { Usuario } from '@/types/admin';
import { CSVLink } from 'react-csv';
import Link from 'next/link';

// Props de usuarios
type PropsUsuarios = {
  usuarios: Usuario[];
  onToggleEstado: (id: number) => void;
};

const TablaUsuarios = ({ usuarios, onToggleEstado }: PropsUsuarios) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroRol('');
    setFiltroEstado('');
  };

  const usuariosFiltrados = useMemo(() => {
    let usuariosProcesados = Array.isArray(usuarios) ? [...usuarios] : [];

    if (terminoBusqueda) {
      const busqueda = terminoBusqueda.toLowerCase();
      usuariosProcesados = usuariosProcesados.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busqueda) ||
        usuario.correo.toLowerCase().includes(busqueda)
      );
    }

    if (filtroRol) {
      usuariosProcesados = usuariosProcesados.filter(usuario => usuario.rol === filtroRol);
    }

    if (filtroEstado) {
      usuariosProcesados = usuariosProcesados.filter(usuario => usuario.estado === filtroEstado);
    }

    return usuariosProcesados;
  }, [usuarios, terminoBusqueda, filtroRol, filtroEstado]);

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Nombre', key: 'nombre' },
    { label: 'Correo', key: 'correo' },
    { label: 'Rol', key: 'rol' },
    { label: 'Estado', key: 'estado' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-sm text-gray-600">Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={terminoBusqueda}
            onChange={e => setTerminoBusqueda(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          />

          <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="comprador">Comprador</option>
            <option value="vendedor">Vendedor</option>
          </select>

          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>

          <button onClick={limpiarFiltros} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-100">
            <FaTimes className="inline mr-1" /> Limpiar
          </button>

          <CSVLink
            data={usuariosFiltrados}
            headers={headers}
            filename={"usuarios_exportados.csv"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
          >
            <FaFileCsv /> Exportar CSV
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id}>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.correo}</td>
                <td className="px-4 py-2 capitalize">{usuario.rol}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${usuario.estado === 'activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {usuario.estado}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => onToggleEstado(usuario.id)}
                    className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1"
                  >
                    {usuario.estado === 'activo' ? <FaLock /> : <FaUnlock />}
                    {usuario.estado === 'activo' ? 'Bloquear' : 'Activar'}
                  </button>

                  <Link
                    href={`/admin/usuarios/${usuario.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ver Perfil <FaExternalLinkAlt size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUsuarios;