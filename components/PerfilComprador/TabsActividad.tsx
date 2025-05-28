//📁 components/PerfilComprador/TabsActividad.tsx

interface TabsActividadProps {
  tab: 'pedidos' | 'resenas';
  setTab: (tab: 'pedidos' | 'resenas') => void;
  exportarPDF: () => void;
}

export default function TabsActividad({ tab, setTab, exportarPDF }: TabsActividadProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setTab('pedidos')}
        className={`px-4 py-2 rounded ${tab === 'pedidos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        📦 Pedidos
      </button>
      <button
        onClick={() => setTab('resenas')}
        className={`px-4 py-2 rounded ${tab === 'resenas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        ✍️ Reseñas
      </button>
      <button
        onClick={exportarPDF}
        className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        📄 Descargar PDF
      </button>
    </div>
  );
}
