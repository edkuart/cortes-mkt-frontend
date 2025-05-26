// 📁 components/PerfilVendedor/BotonesVendedor.tsx

import Link from 'next/link';

export default function BotonesVendedor({ vendedorId }: { vendedorId: number }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <Link href={`/mensajes/${vendedorId}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full">
          💬 Ir al chat con este vendedor
        </button>
      </Link>
      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
        🚫 Reportar perfil
      </button>
    </div>
  );
}
