//📁 hooks/usePedidosResumen.ts

import { useMemo } from 'react';

interface Pedido {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
}

export default function usePedidosResumen(pedidos: Pedido[]) {
  return useMemo(() => {
    const totalGastado = pedidos.reduce((sum, p) => sum + p.total, 0);
    const ultimoPedido = pedidos.length > 0 ? pedidos[pedidos.length - 1] : null;
    const hayPedidoPendiente = pedidos.some(p => p.estado.toLowerCase() === 'pendiente');

    return { totalGastado, ultimoPedido, hayPedidoPendiente };
  }, [pedidos]);
}