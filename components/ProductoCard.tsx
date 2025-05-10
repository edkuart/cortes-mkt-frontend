// 🧩 components/ProductoCard.tsx

import React from 'react';

interface ProductoProps {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  onEditar: (id: number) => void;
  onEliminar: (id: number) => void;
}

const ProductoCard: React.FC<ProductoProps> = ({ id, nombre, precio, imagen, onEditar, onEliminar }) => {
  const agregarAlCarrito = () => {
    const item = { id, nombre, precio };
    const carritoActual = localStorage.getItem('carrito');
    const carrito = carritoActual ? JSON.parse(carritoActual) : [];
    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      {imagen && (
        <img
          src={`http://localhost:4000/${imagen.replace(/\\\\/g, '/')}`}
          alt={nombre}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <strong className="text-gray-800">{nombre}</strong>
          <span className="text-blue-600 font-semibold ml-2">Q{precio}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEditar(id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => onEliminar(id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
      <button
        onClick={agregarAlCarrito}
        className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductoCard;



