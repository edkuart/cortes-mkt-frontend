//📁 components/PerfilComprador/FiltroResenas.tsx

// Tipo para el filtro de reseñas
export type TipoFiltro = 'todas' | 'positivas' | 'regulares' | 'negativas';

interface FiltroResenasProps {
  filtro: TipoFiltro;
  setFiltro: (valor: TipoFiltro) => void;
}

// ⚠️ MOCK PARA DESARROLLO - Este bloque se puede quitar en producción
const mockUser = {
  id: 999,
  nombre: 'Usuario Demo',
  rol: 'comprador',
};

export default function FiltroResenas({ filtro, setFiltro }: FiltroResenasProps) {
  return (
    <div className="mb-3">
      <label htmlFor="filtro" className="text-sm text-gray-600 mr-2">Filtrar:</label>
      <select
        id="filtro"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value as TipoFiltro)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="todas">Todas</option>
        <option value="positivas">Positivas</option>
        <option value="regulares">Regulares</option>
        <option value="negativas">Negativas</option>
      </select>
    </div>
  );
}

