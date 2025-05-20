// 📁 components/Layout.tsx

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import UserDropdownMenu from './UserDropdownMenu';
import { construirUrlAvatar } from '@/utils/usuario';
import TituloPrincipal from './TituloMain';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  const avatarUrl = construirUrlAvatar(user?.fotoPerfil);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {user && (
            <UserDropdownMenu
              avatar={avatarUrl}
              nombre={user.nombre}
              logout={logout}
            />
          )}
          <TituloPrincipal />
          <Link href="/carrito">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ver Carrito 🎢
            </button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout;