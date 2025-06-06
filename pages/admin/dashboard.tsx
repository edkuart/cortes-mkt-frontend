// 📁 frontend/pages/admin/dashboard.tsx

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'; // No se está usando, se puede quitar si no hay planes para ello
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import ResumenKPI from '@/components/Admin/ResumenKPI';
import { FaUsers, FaBoxOpen, FaStar, FaShoppingCart, FaDownload } from 'react-icons/fa';
import RutaProtegida from '@/components/RutaProtegida';
import TablaReportes from '@/components/Admin/Moderacion/TablaReportes'; // Ruta ya corregida
import GraficaEstadisticas from '@/components/Admin/GraficaEstadisticas';
import TablaUsuarios from '@/components/Admin/Usuarios/TablaUsuarios'; // Ruta al componente
import { CSVLink } from 'react-csv'; // Se usa aquí para la exportación general de usuarios del dashboard
import { Usuario } from '@/types/admin'; // --- CAMBIO AQUÍ: Importar Usuario global ---

const DashboardAdmin = () => {
  // const router = useRouter(); // No se usa, se puede quitar
  const { user, token, isAuthenticated } = useAuth();

  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    productos: 0,
    reseñas: 0,
    pedidos: 0,
  });

  // --- CAMBIO AQUÍ: Usar el tipo Usuario importado para el estado ---
  const [todosLosUsuarios, setTodosLosUsuarios] = useState<Usuario[]>([]);
  
  // Los siguientes estados son para los filtros A NIVEL DEL DASHBOARD,
  // TablaUsuarios ahora tiene sus propios filtros internos.
  // Puedes decidir si mantener estos o si TablaUsuarios será la única fuente de filtrado.
  // Por ahora los mantendré, pero si TablaUsuarios se encarga, podrían ser redundantes aquí.
  const [filtroRolDashboard, setFiltroRolDashboard] = useState<string>('');
  const [filtroEstadoDashboard, setFiltroEstadoDashboard] = useState<string>('');
  const [busquedaDashboard, setBusquedaDashboard] = useState<string>('');

  useEffect(() => {
    // No es necesario un console.warn aquí si RutaProtegida o el hook useAuth ya manejan la carga inicial
    // if (!user && isAuthenticated()) { // Podría ser una mejor condición si user tarda en cargarse
    //   console.warn('⏳ Cargando detalles del usuario...');
    //   return;
    // }

    if (isAuthenticated() && user?.rol === 'admin') {
      fetchEstadisticas();
      fetchTodosLosUsuarios(); // Renombrado para claridad
    } else if (isAuthenticated() && user?.rol !== 'admin') {
      console.warn('🔐 Usuario no es admin. Acceso a datos del dashboard restringido.');
      // Aquí podrías redirigir si no lo hace RutaProtegida
      // router.push('/');
    }
    // Se remueve la advertencia de redirección desactivada, ya que RutaProtegida debería manejarlo
    // o se debería implementar la redirección aquí si es necesario.
  }, [user, isAuthenticated, token]); // token añadido por si es necesario para re-fetch si cambia

  const fetchEstadisticas = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:4000/api/admin/resumen', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // ... (manejo de error igual)
        const texto = await res.text(); console.error('❌ Error HTTP en /resumen:', texto); return;
      }
      const data = await res.json();
      setEstadisticas({
        usuarios: data.totalUsuarios ?? 0,
        productos: data.totalProductos ?? 0,
        reseñas: data.totalResenas ?? 0,
        pedidos: data.totalPedidos ?? 0,
      });
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
    }
  };

  const fetchTodosLosUsuarios = async () => { // Renombrado para claridad
    if (!token) return;
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // ... (manejo de error igual)
        const texto = await res.text(); console.error('❌ Error HTTP en /usuarios:', texto); return;
      }
      const data = await res.json();
      // Asegurarse que data es un array y que cada item tiene los campos esperados por el tipo Usuario
      if (Array.isArray(data)) {
        setTodosLosUsuarios(data as Usuario[]); // Casting si estás seguro de la estructura
      } else {
        setTodosLosUsuarios([]);
        console.error('❌ Datos de usuarios no son un array:', data);
      }
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      setTodosLosUsuarios([]);
    }
  };

  const cambiarEstadoUsuario = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/usuarios/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // ... (manejo de error igual)
        const texto = await res.text(); console.error('❌ Error HTTP en /usuarios/:id/estado:', texto); return;
      }
      const actualizado = await res.json();
      setTodosLosUsuarios(prev => // Actualizar la lista todosLosUsuarios
        prev.map(usuario =>
          usuario.id === id ? { ...usuario, estado: actualizado.estado } : usuario
        )
      );
    } catch (error) {
      console.error('❌ Error al cambiar estado del usuario:', error);
    }
  };

  // Estos headers y usuariosFiltradosDashboard son para la tabla de usuarios que estaba *inline*
  // en dashboard.tsx. Si TablaUsuarios ahora maneja toda su propia UI de filtros y tabla,
  // esta lógica de filtrado y la tabla inline podrían eliminarse de dashboard.tsx.
  const headersDashboardCSV = [
    { label: 'ID', key: 'id' }, { label: 'Nombre', key: 'nombre' },
    { label: 'Correo', key: 'correo' }, { label: 'Rol', key: 'rol' },
    { label: 'Estado', key: 'estado' }, { label: 'Registrado el', key: 'createdAt' }
  ];

  const usuariosFiltradosDashboard = todosLosUsuarios.filter(u => {
    const coincideBusqueda = u.nombre.toLowerCase().includes(busquedaDashboard.toLowerCase()) || u.correo.toLowerCase().includes(busquedaDashboard.toLowerCase());
    return (
      coincideBusqueda &&
      (!filtroRolDashboard || u.rol === filtroRolDashboard) &&
      (!filtroEstadoDashboard || u.estado === filtroEstadoDashboard)
    );
  });

  return (
    <Layout>
      <Head><title>Panel del Administrador</title></Head>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Panel del Administrador</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ResumenKPI titulo="Usuarios" valor={estadisticas.usuarios} icono={<FaUsers className="text-blue-500" />} color="bg-blue-100" />
          <ResumenKPI titulo="Productos" valor={estadisticas.productos} icono={<FaBoxOpen className="text-green-500" />} color="bg-green-100" />
          <ResumenKPI titulo="Reseñas" valor={estadisticas.reseñas} icono={<FaStar className="text-yellow-500" />} color="bg-yellow-100" />
          <ResumenKPI titulo="Pedidos" valor={estadisticas.pedidos} icono={<FaShoppingCart className="text-purple-500" />} color="bg-purple-100" />
        </div>

        <RutaProtegida rolesPermitidos={['admin']}>
          <TablaReportes />
          <GraficaEstadisticas />
          
          {/* --- CAMBIO AQUÍ: Pasar todosLosUsuarios a TablaUsuarios --- */}
          {/* TablaUsuarios ahora tiene sus propios filtros internos */}
          <TablaUsuarios
            usuarios={todosLosUsuarios} // Pasar la lista completa
            onToggleEstado={cambiarEstadoUsuario}
          />

          {/* La siguiente sección era la tabla de usuarios INLINE en dashboard.tsx */}
          {/* Puedes decidir si la mantienes, la eliminas (si TablaUsuarios la reemplaza por completo) */}
          {/* o la adaptas. Por ahora, la dejo comentada para evitar duplicidad si TablaUsuarios ya hace esto. */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios (Dashboard-local)</h2>
                <p className="text-sm text-gray-600">Mostrando {usuariosFiltradosDashboard.length} de {todosLosUsuarios.length} usuarios</p>
              </div>
              <input type="text" placeholder="Buscar..." value={busquedaDashboard} onChange={e => setBusquedaDashboard(e.target.value)} className="px-3 py-1 border rounded-md text-sm w-60"/>
              <button onClick={() => { setFiltroRolDashboard(''); setFiltroEstadoDashboard(''); setBusquedaDashboard(''); }} className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-100">Limpiar filtros</button>
              <select value={filtroRolDashboard} onChange={e => setFiltroRolDashboard(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
                <option value="">Todos los roles</option> <option value="admin">Admin</option> <option value="comprador">Comprador</option> <option value="vendedor">Vendedor</option>
              </select>
              <select value={filtroEstadoDashboard} onChange={e => setFiltroEstadoDashboard(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
                <option value="">Todos los estados</option> <option value="activo">Activo</option> <option value="bloqueado">Bloqueado</option>
              </select>
              <CSVLink data={usuariosFiltradosDashboard} headers={headersDashboardCSV} filename={"usuarios_dashboard_export.csv"} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700">
                <FaDownload /> Exportar CSV (Dashboard-local)
              </CSVLink>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                    <th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Correo</th><th className="px-4 py-2">Rol</th><th className="px-4 py-2">Estado</th><th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {usuariosFiltradosDashboard.map(usuario => (
                    <tr key={usuario.id}>
                      <td className="px-4 py-2">{usuario.nombre}</td><td className="px-4 py-2">{usuario.correo}</td>
                      <td className="px-4 py-2 capitalize">{usuario.rol}</td>
                      <td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${usuario.estado === 'activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{usuario.estado}</span></td>
                      <td className="px-4 py-2"><button onClick={() => cambiarEstadoUsuario(usuario.id)} className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">{usuario.estado === 'activo' ? 'Bloquear' : 'Activar'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          */}
        </RutaProtegida>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;