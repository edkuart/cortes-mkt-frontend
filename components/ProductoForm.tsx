// 🧩 components/ProductoForm.tsx

import React, { useState, useEffect } from 'react';

interface ProductoFormProps {
  onSubmit?: (formData: FormData) => void;
  productoEditar?: {
    id: number;
    nombre: string;
    precio: number;
    imagen?: string;
  } | null;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ onSubmit = () => {}, productoEditar }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [imagen, setImagen] = useState<File | null>(null);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setPrecio(productoEditar.precio);
    }
  }, [productoEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio.toString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    onSubmit(formData);

    setNombre('');
    setPrecio('');
    setImagen(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md mb-10" encType="multipart/form-data">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-md transition"
      >
        {productoEditar ? 'Actualizar producto' : 'Agregar producto'}
      </button>
    </form>
  );
};

export default ProductoForm;

