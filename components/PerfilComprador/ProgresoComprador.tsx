// 📁 components/PerfilComprador/ProgresoComprador.tsx

interface Props {
  totalPedidos: number;
}

export default function ProgresoComprador({ totalPedidos }: Props) {
  let nivel = '🟢 Comprador Nuevo';
  let meta = 3;

  if (totalPedidos >= 6) {
    nivel = '🟣 Comprador VIP';
    meta = 6;
  } else if (totalPedidos >= 3) {
    nivel = '🔵 Comprador Frecuente';
    meta = 6;
  }

  const progreso = Math.min((totalPedidos / meta) * 100, 100);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-1">🏅 Tu progreso como comprador</h2>
      <p className="text-sm text-gray-600 mb-2">{nivel} · {totalPedidos} de {meta} pedidos</p>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </section>
  );
}