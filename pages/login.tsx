// 📁 pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || 'Error al iniciar sesión');
        toast.error(data.mensaje || 'Error al iniciar sesión');
        return;
      }

      login(data.usuario, data.token);
      toast.success('¡Sesión iniciada!');

      if (data.usuario.rol === 'vendedor') {
        router.push('/dashboard-vendedor');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('No se pudo conectar con el servidor');
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensaje || 'Error al iniciar sesión con Google');
        return;
      }

      toast.success('¡Bienvenido!');
      login(data.usuario, data.token);
      router.push('/');
    } catch (err) {
      console.error('Error login Google:', err);
      toast.error('Fallo al validar el token de Google');
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Error al iniciar sesión con Google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={enviando}
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>

        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
          />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;