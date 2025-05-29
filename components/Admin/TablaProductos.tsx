// 📁 components/Admin/TablaProductos.tsx

import { useEffect, useState } from 'react';
import { FaTrash, FaStar } from 'react-icons/fa';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  vendedor: string;
  destacado: boolean;
}

const TablaProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    // Simulación de datos. Luego se conecta con /api/productos
    setProductos([
      {
        id: 1,
        nombre: 'Corte tradicional',
        precio: 120,
        imagenUrl: 'https://via.placeholder.com/80',
        vendedor: 'Doña Marta',
        destacado: false,
      },
      {
        id: 2,
        nombre: 'Faja tejida',
        precio: 45,
        imagenUrl: 'https://via.placeholder.com/80',
        vendedor: 'Tienda Ixchel',
        destacado: true,
      },
    ]);
  }, []);

  const toggleDestacado = (id: number) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, destacado: !p.destacado } : p
      )
    );
    // Acá iría PATCH /api/productos/:id con el campo destacado actualizado
  };

  const eliminarProducto = (id: number) => {
    if (confirm('¿Seguro que querés eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
      // Acá iría DELETE /api/productos/:id
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gestión de Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm">
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Vendedor</th>
              <th className="px-4 py-2">Destacado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {productos.map(producto => (
              <tr key={producto.id}>
                <td className="px-4 py-2">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">Q{producto.precio}</td>
                <td className="px-4 py-2">{producto.vendedor}</td>
                <td className="px-4 py-2">
                  {producto.destacado ? (
                    <span className="text-yellow-600 font-semibold">Sí</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => toggleDestacado(producto.id)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Marcar como destacado"
                  >
                    <FaStar />
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Eliminar producto"
                  >
                    <FaTrash />
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

export default TablaProductos;
