// 📁 pages/bienvenida.tsx

import Link from 'next/link';
import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import { motion } from 'framer-motion';
import { FaSmile } from 'react-icons/fa';

const BienvenidaPage = () => {
  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <TarjetaGlass className="text-center py-10">
            <FaSmile className="text-jade text-5xl mb-4 mx-auto animate-pulse" />
            <h1 className="text-2xl font-bold text-jade mb-2">¡Bienvenido al marketplace!</h1>
            <p className="text-gray-700 mb-6">
              Ahora podés explorar, comprar o vender cortes tradicionales guatemaltecos.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/comprador/carrito">
                <span className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  Ir al carrito
                </span>
              </Link>
              <Link href="/vendedor/dashboard-vendedor">
                <span className="bg-coral text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                  Ir al panel de vendedor
                </span>
              </Link>
            </div>

            <p className="text-sm text-gray-600 mt-6">
              O volvé al <Link href="/" className="text-blue-600 hover:underline">inicio</Link>.
            </p>
          </TarjetaGlass>
        </motion.div>
      </div>
    </FondoAnimado>
  );
};

export default BienvenidaPage;