// 🥉 components/ProductoForm.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface ProductoFormProps {
  onSubmit?: (formData: FormData) => void;
  productoEditar?: {
    id: number;
    nombre: string;
    precio: number;
    imagen?: string;
    descripcion?: string;
    stock?: number;
    categoria?: string;
  } | null;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ onSubmit = () => {}, productoEditar }) => {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState<number | string>('');
  const [categoria, setCategoria] = useState('');
  const [errorDescripcion, setErrorDescripcion] = useState('');
  const [errorStock, setErrorStock] = useState('');
  const [errorPrecio, setErrorPrecio] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setPrecio(productoEditar.precio);
      setDescripcion(productoEditar.descripcion || '');
      setStock(productoEditar.stock || '');
      setCategoria(productoEditar.categoria || '');
    }
  }, [productoEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valido = true;

    if (!nombre || !descripcion || !precio || !stock) {
      toast.error('Todos los campos deben completarse.');
      valido = false;
    }

    if (descripcion.length < 10) {
      setErrorDescripcion('La descripción debe tener al menos 10 caracteres.');
      valido = false;
    } else if (descripcion.length > 300) {
      setErrorDescripcion('La descripción no puede superar los 300 caracteres.');
      valido = false;
    } else {
      setErrorDescripcion('');
    }

    if (!stock || isNaN(Number(stock)) || Number(stock) < 1) {
      setErrorStock('El stock debe ser al menos 1.');
      valido = false;
    } else {
      setErrorStock('');
    }

    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      setErrorPrecio('El precio debe ser un número mayor que 0.');
      valido = false;
    } else {
      setErrorPrecio('');
    }

    if (!nombre || nombre.trim().length < 3) {
      setErrorNombre('El nombre debe tener al menos 3 caracteres.');
      valido = false;
    } else {
      setErrorNombre('');
    }

    if (imagen && !imagen.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen válida.');
      valido = false;
    }

    if (!valido) return;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio.toString());
    formData.append('descripcion', descripcion);
    formData.append('stock', stock.toString());
    formData.append('categoria', categoria);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast.success(productoEditar ? 'Producto actualizado' : 'Producto agregado');
      if (productoEditar?.id) {
        router.push(`/productos/historial/${productoEditar.id}`);
      }
    } catch (error) {
      toast.error('Error al procesar el producto');
    } finally {
      setIsSubmitting(false);
    }

    if (!productoEditar) {
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setStock('');
      setCategoria('');
      setImagen(null);
    }
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
        {errorNombre && <p className="text-sm text-red-600 mt-1">{errorNombre}</p>}
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
        {errorPrecio && <p className="text-sm text-red-600 mt-1">{errorPrecio}</p>}
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Descripción del producto (entre 10 y 300 caracteres)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={300}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
        <p className="text-xs text-gray-500 text-right">{descripcion.length}/300</p>
        {errorDescripcion && <p className="text-sm text-red-600 mt-1">{errorDescripcion}</p>}
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Stock disponible"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errorStock && <p className="text-sm text-red-600 mt-1">{errorStock}</p>}
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Ej: Ropa, Electrónica, Comida..."
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>
      {imagen && (
        <img
          src={URL.createObjectURL(imagen)}
          alt="Previsualización"
          className="w-full h-40 object-cover rounded mb-4"
        />
      )}
      {productoEditar?.id ? (
        <Link
          href={{ pathname: "/productos/historial/[id]", query: { id: productoEditar.id } }}
          className="block text-sm text-blue-600 underline text-center mb-4"
        >
          🕘 Ver historial de cambios
        </Link>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-md transition"
      >
        {isSubmitting ? 'Guardando...' : productoEditar ? 'Actualizar producto' : 'Agregar producto'}
      </button>
    </form>
  );
};

export default ProductoForm;

