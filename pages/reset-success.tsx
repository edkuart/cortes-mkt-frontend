// 📁 pages/reset-success.tsx

import Link from 'next/link';
import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResetSuccessPage = () => {
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
            <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto animate-bounce" />
            <h1 className="text-2xl font-bold text-jade mb-2">Contraseña actualizada</h1>
            <p className="text-gray-700 mb-6">Tu nueva contraseña se guardó con éxito. Ya puedes iniciar sesión.</p>

            <div className="flex justify-center gap-4">
              <Link href="/login">
                <span className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700 transition">Iniciar sesión</span>
              </Link>
              <Link href="/">
                <span className="text-blue-600 hover:underline">Ir al inicio</span>
              </Link>
            </div>
          </TarjetaGlass>
        </motion.div>
      </div>
    </FondoAnimado>
  );
};

export default ResetSuccessPage;
