// 📁 components/ConversacionCard.tsx

import { useRouter } from 'next/router';

interface Props {
  id: number;
  nombre: string;
  ultimoMensaje: string;
  fecha: string;
  leido: boolean;
  rol?: string;
  ultimoLogin?: string;
}

const ConversacionCard = ({ id, nombre, ultimoMensaje, fecha, leido, rol, ultimoLogin }: Props) => {
  const router = useRouter();

  const estadoConexion = () => {
    if (!ultimoLogin) return null;
    const ultima = new Date(ultimoLogin);
    const ahora = new Date();
    const diferenciaMin = Math.floor((ahora.getTime() - ultima.getTime()) / 60000);

    if (diferenciaMin < 5) return '🟢 En línea';
    if (diferenciaMin < 60) return `🕒 hace ${diferenciaMin} min`;
    const horas = Math.floor(diferenciaMin / 60);
    return `🕒 hace ${horas} h`;
  };

  const rolBadge = () => {
    if (rol === 'vendedor') {
      return <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">🛍 Vendedor</span>;
    } else if (rol === 'comprador') {
      return <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">🛒 Comprador</span>;
    }
    return null;
  };

  return (
    <li
      className={`border p-4 rounded shadow cursor-pointer hover:bg-gray-50 ${!leido ? 'border-green-500' : ''}`}
      onClick={() => router.push(`/mensajes/${id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold flex items-center gap-2">
            {nombre} {rolBadge()}
          </p>
          <p className="text-sm text-gray-600 truncate">{ultimoMensaje}</p>
          <p className="text-xs text-gray-400">{new Date(fecha).toLocaleString()}</p>
        </div>
        <div className="text-xs text-gray-500 text-right min-w-fit">
          {estadoConexion()}
        </div>
      </div>

      {!leido && (
        <span className="text-green-600 text-xs font-bold block mt-1">● Nuevo mensaje</span>
      )}
    </li>
  );
};

export default ConversacionCard;