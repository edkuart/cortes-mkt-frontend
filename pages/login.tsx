// 📁 pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import InputText from '@/components/Form/InputText';
import HeroPrincipal from '@/components/HeroPrincipal';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [erroresCampo, setErroresCampo] = useState<{ [key: string]: string }>({});

  const validarCampos = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (!correo.includes('@') || !correo.includes('.')) nuevosErrores.correo = 'Correo inválido';
    if (contraseña.length < 6) nuevosErrores.contraseña = 'Debe tener al menos 6 caracteres';
    setErroresCampo(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErroresCampo({});

    if (!validarCampos()) return;
    setEnviando(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || 'Error al iniciar sesión');
        toast.error(data.mensaje || 'Error al iniciar sesión');
        return;
      }

      login(data.usuario, data.token);
      toast.success('¡Sesión iniciada!');
      router.push('/bienvenida');

    } catch (err) {
      console.error('Login error:', err);
      setError('No se pudo conectar con el servidor');
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setCargandoGoogle(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensaje || 'Error con Google');
        return;
      }

      login(data.usuario, data.token);
      toast.success('¡Bienvenido!');
      router.push('/bienvenida');
    } catch (err) {
      console.error('Error login Google:', err);
      toast.error('Fallo al validar el token de Google');
    } finally {
      setCargandoGoogle(false);
    }
  };

  return (
    <FondoAnimado>
      <HeroPrincipal />
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-jade mb-6">Iniciar sesión</h1>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <InputText
              label="Correo electrónico"
              value={correo}
              onChange={setCorreo}
              type="email"
              error={erroresCampo.correo}
            />
            <div className="relative">
              <InputText
                label="Contraseña"
                value={contraseña}
                onChange={setContraseña}
                type={mostrar ? 'text' : 'password'}
                error={erroresCampo.contraseña}
              />
              <button
                type="button"
                className="absolute top-8 right-3 text-gray-600"
                onClick={() => setMostrar(!mostrar)}
              >
                {mostrar ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-coral text-white py-2 rounded hover:bg-orange-500 transition"
              disabled={enviando}
            >
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-sm text-right mt-2 text-blue-600 hover:underline cursor-pointer">
              <Link href="/recuperar-password">¿Olvidaste tu contraseña?</Link>
            </p>
          </form>

          <div className="text-center mt-6">
            {cargandoGoogle ? (
              <div className="text-sm text-gray-600">Validando cuenta Google...</div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Error con Google')}
                useOneTap
              />
            )}
          </div>

          <p className="text-sm text-center mt-4 text-gray-700">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-jade hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default LoginPage;