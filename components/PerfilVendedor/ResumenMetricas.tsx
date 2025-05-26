// 📁 components/PerfilVendedor/ResumenMetricas.tsx

interface Metrica {
  titulo: string;
  valor: string | number;
  color?: string;
  icono?: React.ReactNode;
}

interface Props {
  metricas: Metrica[];
}

export default function ResumenMetricas({ metricas }: Props) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {metricas.map((m, idx) => (
        <div
          key={idx}
          className="p-4 bg-white rounded shadow"
        >
          <h4 className="text-sm text-gray-500 flex items-center gap-2">
            {m.icono} {m.titulo}
          </h4>
          <p className={`text-xl font-bold ${m.color ?? 'text-gray-700'}`}>{m.valor}</p>
        </div>
      ))}
    </div>
  );
}
