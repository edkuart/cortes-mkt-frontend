// 📁 pages/404.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FondoAnimado from '@/components/FondoAnimado';
import TarjetaGlass from '@/components/TarjetaGlass';

const PaginaNoEncontrada = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <FondoAnimado className="flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TarjetaGlass className="max-w-md text-center">
          <p className="text-6xl mb-4">🚫🛒</p>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            404 - Página no encontrada
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Parece que esta ruta no existe. Te llevaremos al inicio en unos segundos...
          </p>

          <Link href="/comprador/carrito">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <FaShoppingCart /> Ir a tu carrito
            </span>
          </Link>

          <Link href="/vendedor/dashboard-vendedor">
            <span className="inline-flex items-center gap-2 mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              <FaChartLine /> Ir al dashboard del vendedor
            </span>
          </Link>

          <Link href="/">
            <span className="inline-block mt-6 text-sm text-gray-800 dark:text-gray-300 hover:underline">
              🏠 Volver al inicio ahora
            </span>
          </Link>
        </TarjetaGlass>
      </motion.div>
    </FondoAnimado>
  );
};

export default PaginaNoEncontrada;