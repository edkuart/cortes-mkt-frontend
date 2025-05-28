// 📁 components/PerfilComprador/InsigniasComprador.tsx

interface Pedido {
  id: number;
  detalles?: {
    producto: {
      id: number;
      nombre: string;
      categoria?: string;
    };
    cantidad: number;
  }[];
}

interface Resena {
  id: number;
  comentario: string;
}

interface Props {
  pedidos: Pedido[];
  resenas: Resena[];
}

export default function InsigniasComprador({ pedidos, resenas }: Props) {
  const totalPedidos = pedidos.length;
  const productosComprados: Record<number, number> = {};
  const categorias: Record<string, number> = {};

  for (const pedido of pedidos) {
    if (!pedido.detalles) continue;
    for (const d of pedido.detalles) {
      productosComprados[d.producto.id] = (productosComprados[d.producto.id] || 0) + d.cantidad;
      const categoria = d.producto.categoria || 'otro';
      categorias[categoria] = (categorias[categoria] || 0) + d.cantidad;
    }
  }

  const tieneRecompra = Object.values(productosComprados).some((cantidad) => cantidad >= 2);
  const criticoActivo = resenas.length >= 3;
  const lealCategoria = Object.values(categorias).some((cantidad) => cantidad >= 5);
  const primerPedido = totalPedidos >= 1;
  const frecuente = totalPedidos >= 6;

  const insignias: string[] = [];
  if (primerPedido) insignias.push('🧾 Primer Pedido');
  if (tieneRecompra) insignias.push('🔁 Recompra Confirmada');
  if (criticoActivo) insignias.push('⭐ Crítico Activo');
  if (lealCategoria) insignias.push('🔥 Leal a la categoría');
  if (frecuente) insignias.push('🏅 Comprador Frecuente');

  if (insignias.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">🏆 Tus Insignias</h2>
      <ul className="flex flex-wrap gap-3 text-sm">
        {insignias.map((i, idx) => (
          <li key={idx} className="bg-gray-100 px-3 py-1 rounded-full">{i}</li>
        ))}
      </ul>
    </section>
  );
}