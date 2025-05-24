// 📄 pages/productos/editar/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProductoForm from '@/components/ProductoForm';

const EditarProductoPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/api/productos/${id}`)
        .then(res => res.json())
        .then(data => setProducto(data))
        .catch(() => toast.error('Error al cargar producto'))
        .finally(() => setCargando(false));
    }
  }, [id]);

  const actualizarProducto = async (formData: FormData) => {
    try {
      const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success('Producto actualizado correctamente');
      router.push('/vendedor/mis-productos');
    } catch {
      toast.error('Error al actualizar el producto');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Editar Producto</h1>
      {cargando ? <p>Cargando...</p> : producto && (
        <ProductoForm productoEditar={producto} onSubmit={actualizarProducto} />
      )}
    </div>
  );
};

export default EditarProductoPage;


