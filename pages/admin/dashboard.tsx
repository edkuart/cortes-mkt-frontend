// 📁 frontend/pages/admin/dashboard.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import ResumenKPI from '@/components/Admin/ResumenKPI';
import { FaUsers, FaBoxOpen, FaStar, FaShoppingCart, FaDownload } from 'react-icons/fa';
import RutaProtegida from '@/components/RutaProtegida';
import TablaReportes from '@/components/Admin/TablaReportes';
import GraficaEstadisticas from '@/components/Admin/GraficaEstadisticas';
import TablaUsuarios from '@/components/Admin/TablaUsuarios';
import { CSVLink } from 'react-csv';

const DashboardAdmin = () => {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    productos: 0,
    reseñas: 0,
    pedidos: 0,
  });

  interface UsuarioAdmin {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
    estado: 'activo' | 'bloqueado';
  }

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [filtroRol, setFiltroRol] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    if (!user) {
      console.warn('⏳ Cargando usuario...');
      return;
    }

    if (!isAuthenticated() || user.rol !== 'admin') {
      console.warn('🔐 Usuario no autorizado. Redirección desactivada temporalmente.');
      return;
    }

    fetchEstadisticas();
    fetchUsuarios();
  }, [user]);

  const fetchEstadisticas = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/resumen', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const texto = await res.text();
        console.error('❌ Error HTTP en /resumen:', texto);
        return;
      }

      const data = await res.json();
      setEstadisticas({
        usuarios: data.totalUsuarios,
        productos: data.totalProductos,
        reseñas: data.totalResenas,
        pedidos: data.totalPedidos,
      });
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const texto = await res.text();
        console.error('❌ Error HTTP en /usuarios:', texto);
        return;
      }

      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
    }
  };

  const cambiarEstadoUsuario = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/usuarios/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const texto = await res.text();
        console.error('❌ Error HTTP en /usuarios/:id/estado:', texto);
        return;
      }

      const actualizado = await res.json();

      setUsuarios(prev =>
        prev.map(usuario =>
          usuario.id === id ? { ...usuario, estado: actualizado.estado } : usuario
        )
      );
    } catch (error) {
      console.error('❌ Error al cambiar estado del usuario:', error);
    }
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Nombre', key: 'nombre' },
    { label: 'Correo', key: 'correo' },
    { label: 'Rol', key: 'rol' },
    { label: 'Estado', key: 'estado' },
  ];

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return (
      coincideBusqueda &&
      (!filtroRol || u.rol === filtroRol) &&
      (!filtroEstado || u.estado === filtroEstado)
    );
  });

  return (
    <Layout>
      <Head>
        <title>Panel del Administrador</title>
      </Head>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Panel del Administrador
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ResumenKPI titulo="Usuarios" valor={estadisticas.usuarios} icono={<FaUsers className="text-blue-500" />} color="bg-blue-100" />
          <ResumenKPI titulo="Productos" valor={estadisticas.productos} icono={<FaBoxOpen className="text-green-500" />} color="bg-green-100" />
          <ResumenKPI titulo="Reseñas" valor={estadisticas.reseñas} icono={<FaStar className="text-yellow-500" />} color="bg-yellow-100" />
          <ResumenKPI titulo="Pedidos" valor={estadisticas.pedidos} icono={<FaShoppingCart className="text-purple-500" />} color="bg-purple-100" />
        </div>

        <RutaProtegida rolesPermitidos={['admin']}>
          <TablaReportes />
          <GraficaEstadisticas />
          <TablaUsuarios />

          <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <p className="text-sm text-gray-600">Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</p>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm w-60"
              />
              <button onClick={() => { setFiltroRol(''); setFiltroEstado(''); setBusqueda(''); }} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-100">
                Limpiar filtros
              </button>
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
              <CSVLink
                data={usuariosFiltrados}
                headers={headers}
                filename={"usuarios_exportados.csv"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
              >
                <FaDownload /> Exportar CSV
              </CSVLink>
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
                      <td className="px-4 py-2">
                        <button
                          onClick={() => cambiarEstadoUsuario(usuario.id)}
                          className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          {usuario.estado === 'activo' ? 'Bloquear' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RutaProtegida>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;