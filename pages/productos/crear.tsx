// 📁 pages/productos/crear.tsx

import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import ProductoForm from '@/components/ProductoForm';

export default function CrearProductoPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.append('vendedorId', String(user?.id));

      const res = await fetch('http://localhost:4000/api/productos', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error();
      toast.success('Producto creado correctamente');
      router.push('/vendedor/mis-productos');
    } catch {
      toast.error('Error al crear el producto');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Nuevo Producto</h1>
      <ProductoForm onSubmit={handleSubmit} />
    </div>
  );
}
