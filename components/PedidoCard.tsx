// 📁 components/PedidoCard.tsx

interface PedidoProps {
    id: number;
    total: number;
    estadoTexto: string;
    // otros campos
  }
  
  const PedidoCard: React.FC<PedidoProps> = ({ id, total, estadoTexto }) => {
    return (
      <div className="border p-4 rounded mb-4 bg-white shadow">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold">Pedido #{id}</h3>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            estadoTexto === 'Entregado' ? 'bg-green-200 text-green-800' :
            estadoTexto === 'En camino' ? 'bg-yellow-200 text-yellow-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {estadoTexto}
          </span>
        </div>
        <p className="mt-2 text-gray-700">Total: Q{total}</p>
      </div>
    );
  };
  