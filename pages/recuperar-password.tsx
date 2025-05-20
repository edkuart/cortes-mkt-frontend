// 📁 pages/recuperar-password.tsx

import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import InputText from '@/components/Form/InputText';

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('http://localhost:4000/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || 'Error al enviar el correo');

      toast.success('📧 Revisa tu correo para restablecer la contraseña');
      setSuccess(true);
      setCorreo('');
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-jade mb-6">Recuperar contraseña</h1>

          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center mb-4">Correo enviado correctamente</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputText
              label="Correo electrónico"
              value={correo}
              onChange={setCorreo}
              type="email"
              required
            />

            <button
              type="submit"
              disabled={enviando}
              className="bg-jade text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {enviando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-700">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/login" className="text-jade hover:underline">
              Inicia sesión
            </Link>
          </p>
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default RecuperarPassword;
