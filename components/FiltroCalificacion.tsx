// 📦 components/FiltroCalificacion.tsx

interface Props {
    valor: string;
    onChange: (nuevo: string) => void;
  }
  
  const opciones = [
    { label: '⭐ Todos', value: 'todas' },
    { label: '⭐⭐⭐⭐⭐ Solo 5 estrellas', value: '5' },
    { label: '⭐⭐⭐⭐ 4 estrellas o más', value: '4mas' },
    { label: '⭐⭐⭐ o menos', value: '3menos' }
  ];
  
  export default function FiltroCalificacion({ valor, onChange }: Props) {
    return (
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium text-gray-700">Filtrar por calificación:</span>
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {opciones.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>
    );
  }
  