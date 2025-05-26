// 📁 components/PerfilVendedor/PaginadorProductos.tsx

interface Props {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (nueva: number) => void;
}

export default function PaginadorProductos({ paginaActual, totalPaginas, cambiarPagina }: Props) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        ← Anterior
      </button>
      <span className="px-3 py-1 text-sm text-gray-600">
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente →
      </button>
    </div>
  );
}