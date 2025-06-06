// 📁 frontend/components/Admin/TablaUsuarios.tsx

import { useEffect, useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: 'activo' | 'bloqueado';
};

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    // Simulación, reemplazar con fetch real a /api/usuarios
    setUsuarios([
      { id: 1, nombre: 'Ana López', correo: 'ana@example.com', rol: 'comprador', estado: 'activo' },
      { id: 2, nombre: 'Carlos Méndez', correo: 'carlos@example.com', rol: 'vendedor', estado: 'bloqueado' },
    ]);
  }, []);

  const cambiarEstado = (id: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === id
          ? { ...usuario, estado: usuario.estado === 'activo' ? 'bloqueado' : 'activo' }
          : usuario
      )
    );
    // Aquí iría el fetch PATCH al backend para actualizar el estado
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gestión de Usuarios</h2>
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
            {usuarios.map(usuario => (
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
                    onClick={() => cambiarEstado(usuario.id)}
                    className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1"
                  >
                    {usuario.estado === 'activo' ? <FaLock /> : <FaUnlock />}
                    {usuario.estado === 'activo' ? 'Bloquear' : 'Activar'}
                  </button>
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