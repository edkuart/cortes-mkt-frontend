// 📁 components/Producto/AgregarAFavoritos.tsx

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  productoId: number;
  usuarioId: number;
}

export default function AgregarAFavoritos({ productoId, usuarioId }: Props) {
  const [esFavorito, setEsFavorito] = useState<boolean>(false);

  useEffect(() => {
    // Simulación inicial (reemplazar por fetch real)
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setEsFavorito(favoritos.includes(productoId));
  }, [productoId]);

  const toggleFavorito = async () => {
    try {
      let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      if (esFavorito) {
        favoritos = favoritos.filter((id: number) => id !== productoId);
        toast('❌ Eliminado de favoritos');
      } else {
        favoritos.push(productoId);
        toast.success('🧡 Agregado a favoritos');
      }
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      setEsFavorito(!esFavorito);
    } catch (err) {
      toast.error('Hubo un error al actualizar favoritos');
    }
  };

  return (
    <button
      onClick={toggleFavorito}
      className={`mt-2 px-4 py-1 rounded text-sm ${
        esFavorito ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    </button>
  );
}