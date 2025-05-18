import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface Pedido {
  id: number;
  createdAt: string;
  total: number;
  estadoTexto: string;
  mostrarBotonDespachar: boolean;
  comprador?: {
    nombreCompleto: string;
    correo: string;
  };
  detalles: {
    producto: {
      nombre: string;
    };
    cantidad: number;
  }[];
}

export default function PedidosVendedorPage() {
  const { usuario, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'enCamino' | 'pendientes'>('todos');
  const [busquedaCliente, setBusquedaCliente] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!isAuthenticated() || !usuario) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/pedidos?vendedorId=${usuario.id}`);
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener pedidos del vendedor:', error);
        toast.error('Error al obtener pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [usuario]);

  const marcarComoDespachado = async (pedidoId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/entregas/${pedidoId}/confirmar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'repartidor' }),
      });

      if (!res.ok) throw new Error('Error al despachar el pedido');

      const data = await res.json();
      toast.success('📦 Pedido marcado como despachado con éxito!', {
        duration: 4000,
        icon: '✅',
      });

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId
            ? { ...p, estadoTexto: 'En camino', mostrarBotonDespachar: false }
            : p
        )
      );
    } catch (error) {
      console.error('❌ Error al despachar pedido:', error);
      toast.error('🚫 No se pudo despachar el pedido', {
        duration: 4000,
        icon: '❗',
      });
    }
  };

  const exportarExcel = () => {
    const rows = pedidosFiltrados.map((p) => ({
      ID: p.id,
      Fecha: new Date(p.createdAt).toLocaleString(),
      Cliente: p.comprador?.nombreCompleto || '',
      Correo: p.comprador?.correo || '',
      Total: p.total,
      Estado: p.estadoTexto,
      Productos: p.detalles.map((d) => `${d.producto.nombre} x ${d.cantidad}`).join(', '),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'pedidos.xlsx');
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtro === 'enCamino' && pedido.estadoTexto !== 'En camino') return false;
    if (filtro === 'pendientes' && pedido.estadoTexto === 'Entregado') return false;
    if (busquedaCliente.trim() && pedido.comprador) {
      const nombre = pedido.comprador.nombreCompleto.toLowerCase();
      if (!nombre.includes(busquedaCliente.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">📬 Pedidos Recibidos</h1>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          <button onClick={() => setFiltro('todos')} className={`px-3 py-1 rounded ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Todos
          </button>
          <button onClick={() => setFiltro('enCamino')} className={`px-3 py-1 rounded ${filtro === 'enCamino' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            En camino
          </button>
          <button onClick={() => setFiltro('pendientes')} className={`px-3 py-1 rounded ${filtro === 'pendientes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Pendientes
          </button>
        </div>
        <input
          type="text"
          value={busquedaCliente}
          onChange={(e) => setBusquedaCliente(e.target.value)}
          placeholder="Buscar por cliente..."
          className="border px-3 py-1 rounded w-full max-w-xs"
        />
        <button
          onClick={exportarExcel}
          className="ml-auto px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay pedidos que coincidan con los filtros.</p>
      ) : (
        <ul className="space-y-4">
          {pedidosFiltrados.map((pedido) => (
            <li key={pedido.id} className="border rounded p-4">
              <p className="text-sm text-gray-500 mb-1">Fecha: {new Date(pedido.createdAt).toLocaleString()}</p>
              <p className="inline-block px-2 py-1 text-sm rounded font-medium bg-blue-100 text-blue-700 mb-2">
                Estado: {pedido.estadoTexto}
              </p>
              <p className="font-semibold mb-1">Total: Q{pedido.total}</p>
              {pedido.comprador && (
                <p className="text-sm text-gray-700 mb-2">
                  Cliente: <span className="font-medium">{pedido.comprador.nombreCompleto}</span> — {pedido.comprador.correo}
                </p>
              )}
              <ul className="list-disc ml-5">
                {pedido.detalles.map((d, index) => (
                  <li key={index}>
                    {d.producto.nombre} x {d.cantidad}
                  </li>
                ))}
              </ul>
              {pedido.mostrarBotonDespachar && (
                <button
                  onClick={() => marcarComoDespachado(pedido.id)}
                  className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Marcar como despachado
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
