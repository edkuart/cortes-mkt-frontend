// 📁 pages/reset-password.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import toast from 'react-hot-toast';

const calcularFortaleza = (password: string) => {
  if (password.length < 6) return 'Débil';
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Fuerte';
  return 'Media';
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const fortaleza = calcularFortaleza(nueva);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || typeof token !== 'string') return toast.error('Token inválido');
    if (nueva !== confirmar) return toast.error('Las contraseñas no coinciden');
    if (nueva.length < 6) return toast.error('Debe tener mínimo 6 caracteres');

    setEnviando(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al cambiar contraseña');
      toast.success('✅ Contraseña actualizada');
      setTimeout(() => router.push('/reset-success'), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-jade mb-6">Nueva contraseña</h2>
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={mostrarNueva ? 'text' : 'password'}
                placeholder="Nueva contraseña"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarNueva(!mostrarNueva)}
                className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
              >
                {mostrarNueva ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {nueva && (
              <p className={`text-sm font-medium ${fortaleza === 'Fuerte' ? 'text-green-600' : fortaleza === 'Media' ? 'text-yellow-600' : 'text-red-600'}`}>
                Fortaleza: {fortaleza}
              </p>
            )}

            <div className="relative">
              <input
                type={mostrarConfirmar ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
              >
                {mostrarConfirmar ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="bg-coral text-white py-2 px-4 rounded hover:bg-orange-500 transition"
            >
              {enviando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default ResetPasswordPage;