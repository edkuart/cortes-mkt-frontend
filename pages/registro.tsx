// 📁 pages/registro.tsx

import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import InputText from '@/components/Form/InputText';
import SelectRol from '@/components/Form/SelectRol';
import InputArchivo from '@/components/Form/InputArchivo';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/hooks/useAuth';
import { useFormularioRegistro } from '@/hooks/useFormularioRegistro';
import usePasswordStrength from '@/hooks/usePasswordStrength';
import validarRegistro from '@/utils/validarRegistro';
import FondoAnimado from '../components/FondoAnimado';
import TarjetaGlass from '../components/TarjetaGlass';
import HeroPrincipal from '@/components/HeroPrincipal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';

const RegistroPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { formulario, handleChange } = useFormularioRegistro();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [erroresCampo, setErroresCampo] = useState<{ [key: string]: string }>({});
  const fortaleza = usePasswordStrength(formulario.contraseña);

  const validarFormulario = () => {
    const nuevosErrores = validarRegistro(formulario);
    setErroresCampo(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setError('Corrige los errores antes de continuar.');
      return false;
    }
    return true;
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;
    setEnviando(true);

    try {
      const formData = new FormData();
      Object.entries(formulario).forEach(([key, value]) => {
        if (key !== 'confirmarContrasena' && value && typeof value !== 'object') {
          formData.append(key, value);
        }
      });

      if (formulario.rol === 'vendedor') {
        if (formulario.fotoDPIFrente) formData.append('fotoDPIFrente', formulario.fotoDPIFrente);
        if (formulario.fotoDPIReverso) formData.append('fotoDPIReverso', formulario.fotoDPIReverso);
        if (formulario.selfieConDPI) formData.append('selfieConDPI', formulario.selfieConDPI);
        if (formulario.licenciaConducir) formData.append('licenciaConducir', formulario.licenciaConducir);
      }

      const res = await fetch('http://localhost:4000/api/auth/registro', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensaje || 'Error al registrarse');
        return;
      }

      toast.success('Usuario registrado. Ahora inicia sesión.');
      router.push('/login');
    } catch (err) {
      console.error('Registro error:', err);
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
        toast.error(data.mensaje || 'Error con Google');
        return;
      }

      login(data.usuario, data.token);
      toast.success('Sesión iniciada con Google');

      router.push(data.usuario.rol === 'vendedor' ? '/vendedor/dashboard-vendedor' : '/');
    } catch (error) {
      toast.error('Error al iniciar sesión con Google');
    }
  };

  return (
    <FondoAnimado>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <HeroPrincipal />
      </motion.div>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
        <TarjetaGlass>
          <h1 className="text-3xl font-bold text-center text-jade mb-6">Crear cuenta</h1>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleRegistro} className="flex flex-col gap-4">
            <InputText label="Nombre completo" value={formulario.nombreCompleto} onChange={(v) => handleChange('nombreCompleto', v)} error={erroresCampo.nombreCompleto} />
            <InputText label="Correo electrónico" value={formulario.correo} onChange={(v) => handleChange('correo', v)} type="email" error={erroresCampo.correo} />

            <div className="relative">
              <InputText
                label="Contraseña"
                value={formulario.contraseña}
                onChange={(v) => handleChange('contraseña', v)}
                type={mostrarContrasena ? 'text' : 'password'}
                error={erroresCampo.contraseña}
              />
              <button
                type="button"
                className="absolute top-8 right-3 text-gray-600"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
              </button>

              {formulario.contraseña && (
                <>
                  <p className={`text-sm font-medium mt-2 ${
                    fortaleza.nivel === 'Fuerte' ? 'text-green-600' :
                    fortaleza.nivel === 'Buena' ? 'text-blue-600' :
                    fortaleza.nivel === 'Regular' ? 'text-yellow-600' : 'text-red-600'
                  }`}>Fortaleza: {fortaleza.nivel}</p>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className={`h-2 ${fortaleza.color} rounded transition-all duration-300`}
                        style={{ width: fortaleza.porcentaje }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Fortaleza visual: <span className="font-medium">{fortaleza.nivel}</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            <InputText
              label="Confirmar contraseña"
              value={formulario.confirmarContrasena}
              onChange={(v) => handleChange('confirmarContrasena', v)}
              type={mostrarContrasena ? 'text' : 'password'}
              error={erroresCampo.confirmarContrasena}
            />

            <SelectRol value={formulario.rol} onChange={(v) => handleChange('rol', v)} />

            {formulario.rol === 'vendedor' && (
              <>
                <InputArchivo label="Foto DPI Frente" name="fotoDPIFrente" onChange={handleChange} error={erroresCampo.fotoDPIFrente} />
                <InputArchivo label="Foto DPI Reverso" name="fotoDPIReverso" onChange={handleChange} error={erroresCampo.fotoDPIReverso} />
                <InputArchivo label="Selfie con DPI" name="selfieConDPI" onChange={handleChange} error={erroresCampo.selfieConDPI} />
                <InputArchivo label="Licencia de Conducir" name="licenciaConducir" onChange={handleChange} error={erroresCampo.licenciaConducir} />
              </>
            )}

            <button
              type="submit"
              className="bg-coral text-white py-2 rounded hover:bg-orange-500 transition"
              disabled={enviando}
            >
              {enviando ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="text-center mt-6">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Error con Google')} />
          </div>

          <p className="text-sm text-center mt-4 text-gray-700">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-jade hover:underline">
              Inicia sesión
            </Link>
          </p>
        </TarjetaGlass>
        </motion.div>
      </div>
    </FondoAnimado>
  );
};

export default RegistroPage;