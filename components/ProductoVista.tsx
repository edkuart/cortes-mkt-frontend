// 📁 components/ProductoVista.tsx

import React from 'react';

interface ProductoVistaProps {
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    promedioCalificacion: number;
    reseñas: {
      id: number;
      comentario: string;
      calificacion: number;
      comprador: {
        nombreCompleto: string;
      };
    }[];
  };
}

const ProductoVista: React.FC<ProductoVistaProps> = ({ producto }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md"
        />
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
          <p className="text-lg text-gray-700 mb-2">{producto.descripcion}</p>
          <p className="text-xl font-semibold text-blue-700 mb-2">Q{producto.precio.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-4">Categoría: {producto.categoria}</p>
          <p className="text-sm text-yellow-600 font-medium mb-4">
            ⭐ Calificación promedio: {producto.promedioCalificacion?.toFixed(1) || 'No hay'} / 5
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
            Contactar vendedor
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">📝 Reseñas del producto</h2>
        {producto.reseñas.length === 0 ? (
          <p className="text-gray-500">Este producto aún no tiene reseñas.</p>
        ) : (
          <ul className="space-y-4">
            {producto.reseñas.map(reseña => (
              <li key={reseña.id} className="border rounded-lg p-4 bg-white shadow">
                <p className="text-sm font-semibold text-blue-800">{reseña.comprador.nombreCompleto}</p>
                <p className="text-sm">{reseña.comentario}</p>
                <p className="text-xs text-yellow-600">⭐ {reseña.calificacion} / 5</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductoVista;