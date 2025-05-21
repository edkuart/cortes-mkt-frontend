// 📁 components/Layout.tsx

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserDropdownMenu from './UserDropdownMenu';
import { construirUrlAvatar } from '@/utils/usuario';
import TituloPrincipal from './TituloMain';
import { useMensajesContext } from '@/context/MensajesContext';
import { useVerificarMensajesNoLeidos } from '@/hooks/useVerificarMensajes';
import { useRouter } from 'next/router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, token } = useAuth();
  const { hayNoLeidos, setHayNoLeidos } = useMensajesContext();
  const [cantidadNoLeidos, setCantidadNoLeidos] = useState(0);
  const avatarUrl = construirUrlAvatar(user?.fotoPerfil);
  const router = useRouter();

  const verificarMensajesNoLeidos = useVerificarMensajesNoLeidos((estado, cantidad) => {
    setHayNoLeidos(estado);
    setCantidadNoLeidos(cantidad);
  });

  useEffect(() => {
    verificarMensajesNoLeidos();
  }, [verificarMensajesNoLeidos]);

  const handleIrAConversaciones = () => {
    setHayNoLeidos(false);
    setCantidadNoLeidos(0);
    router.push('/conversaciones');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-4 flex-wrap">
          {user && (
            <div className="flex items-center gap-4">
              <UserDropdownMenu
                avatar={avatarUrl}
                nombre={user.nombre}
                logout={logout}
              />
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{user.nombre}</p>
                <p>{user.correo}</p>
                <p className="text-xs text-gray-500">
                  {user.rol === 'vendedor' ? '🛍 Vendedor' : '🛒 Comprador'}
                  {(user as any)?.estado === 'aprobado' && (
                    <span className="ml-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                      Aprobado
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <TituloPrincipal />

          <div className="flex gap-2">
            <Link href="/carrito">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ver Carrito 🎢
              </button>
            </Link>

            <button
              onClick={handleIrAConversaciones}
              className="relative bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Conversaciones 💬
              {hayNoLeidos && cantidadNoLeidos > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {cantidadNoLeidos}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout;