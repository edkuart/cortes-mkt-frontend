// 📁 components/PerfilVendedor/InsigniasVendedor.tsx

interface Props {
  promedio: number;
  cantidadProductos: number;
  cantidadResenas: number;
}

export default function InsigniasVendedor({ promedio, cantidadProductos, cantidadResenas }: Props) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {promedio >= 4.5 && (
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">🏅 Muy Valorado</span>
      )}
      {cantidadProductos >= 20 && (
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">🥇 Top en Ventas</span>
      )}
      {cantidadResenas >= 50 && (
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">💼 Vendedor Experto</span>
      )}
    </div>
  );
}
