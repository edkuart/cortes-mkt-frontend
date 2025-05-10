import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
}

export default function CarritoPage() {
  const { usuario, isAuthenticated } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('carrito');
    if (data) setCarrito(JSON.parse(data));
  }, []);

  const realizarPedido = async () => {
    if (!isAuthenticated() || !usuario) {
      alert('Debes iniciar sesión para hacer un pedido.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compradorId: usuario.id,
          productos: carrito.map((item) => ({ productoId: item.id, cantidad: 1 })),
        }),
      });

      if (res.ok) {
        alert('✅ Pedido realizado con éxito');
        localStorage.removeItem('carrito');
        setCarrito([]);
        router.push('/');
      } else {
        throw new Error('Error al enviar el pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error al realizar el pedido.');
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-gray-600">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="mb-4">
            {carrito.map((item) => (
              <li key={item.id} className="border p-2 mb-2 rounded">
                {item.nombre} - Q{item.precio}
              </li>
            ))}
          </ul>

          <p className="font-semibold mb-4">Total: Q{total}</p>

          <button
            onClick={realizarPedido}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Realizar pedido
          </button>
        </>
      )}
    </div>
  );
}
