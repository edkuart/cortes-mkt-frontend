// 📁 pages/cambiar-password.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import FondoAnimado from '@/components/FondoAnimado';
import TarjetaGlass from '@/components/TarjetaGlass';
import InputText from '@/components/Form/InputText';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CambiarPasswordPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const calcularFortaleza = (password: string) => {
    if (password.length < 6) return 'Débil';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) return 'Fuerte';
    return 'Media';
  };

  const fortaleza = calcularFortaleza(nuevaContrasena);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaContrasena || nuevaContrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaContrasena !== confirmacion) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${user?.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nuevaContrasena })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensaje || 'Error al cambiar la contraseña.');
        return;
      }

      toast.success('Contraseña actualizada con éxito.');
      router.push('/perfil');
    } catch (error) {
      toast.error('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-jade mb-6">Cambiar Contraseña</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <InputText
                label="Nueva contraseña"
                type={mostrarNueva ? 'text' : 'password'}
                value={nuevaContrasena}
                onChange={setNuevaContrasena}
              />
              <button
                type="button"
                className="absolute top-8 right-3 text-gray-600"
                onClick={() => setMostrarNueva(!mostrarNueva)}
              >
                {mostrarNueva ? <FaEyeSlash /> : <FaEye />}
              </button>
              {nuevaContrasena && (
                <p className={`text-sm font-medium mt-1 ${fortaleza === 'Fuerte' ? 'text-green-600' : fortaleza === 'Media' ? 'text-yellow-600' : 'text-red-600'}`}>
                  Fortaleza: {fortaleza}
                </p>
              )}
            </div>

            <div className="relative">
              <InputText
                label="Confirmar contraseña"
                type={mostrarConfirmar ? 'text' : 'password'}
                value={confirmacion}
                onChange={setConfirmacion}
              />
              <button
                type="button"
                className="absolute top-8 right-3 text-gray-600"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              >
                {mostrarConfirmar ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-jade text-white py-2 px-4 rounded hover:bg-green-700 transition"
              disabled={cargando}
            >
              {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default CambiarPasswordPage;