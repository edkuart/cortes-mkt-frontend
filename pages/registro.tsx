// 📁 pages/registro.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import InputText from '@/components/Form/InputText';
import SelectRol from '@/components/Form/SelectRol';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useAuth } from '@/hooks/useAuth';

const RegistroPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formulario, setFormulario] = useState({
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    rol: 'comprador',
    fotoDPIFrente: null as File | null,
    fotoDPIReverso: null as File | null,
    selfieConDPI: null as File | null,
    licenciaConducir: null as File | null
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormulario(prev => ({ ...prev, [field]: value }));
  };

  const validarFormulario = () => {
    const faltantes: string[] = [];
    if (!formulario.nombreCompleto.trim()) faltantes.push('Nombre completo');
    if (!formulario.correo.includes('@') || !formulario.correo.includes('.')) faltantes.push('Correo válido');
    if (formulario.contraseña.length < 6) faltantes.push('Contraseña de al menos 6 caracteres');

    if (formulario.rol === 'vendedor') {
      if (!formulario.fotoDPIFrente) faltantes.push('Foto DPI Frente');
      if (!formulario.fotoDPIReverso) faltantes.push('Foto DPI Reverso');
      if (!formulario.selfieConDPI) faltantes.push('Selfie con DPI');
      if (!formulario.licenciaConducir) faltantes.push('Licencia de Conducir');
    }

    if (faltantes.length > 0) {
      setError(`Faltan los siguientes campos: ${faltantes.join(', ')}`);
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
        if (value && typeof value !== 'object') formData.append(key, value);
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
      console.log('📦 Respuesta del backend:', data);
  
      if (!res.ok) {
        toast.error(data.mensaje || 'Error con Google');
        return;
      }
  
      login(data.usuario, data.token); 
      toast.success('Sesión iniciada con Google');
  
      if (data.usuario.rol === 'vendedor') {
        router.push('/dashboard-vendedor');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión con Google');
    }
  };
  

  const InputArchivo = ({ label, name }: { label: string; name: keyof typeof formulario }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input type="file" onChange={(e) => handleChange(name, e.target.files?.[0] || null)} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleRegistro} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <InputText label="Nombre completo" value={formulario.nombreCompleto} onChange={(v) => handleChange('nombreCompleto', v)} />
        <InputText label="Correo electrónico" value={formulario.correo} onChange={(v) => handleChange('correo', v)} type="email" />
        <InputText label="Contraseña" value={formulario.contraseña} onChange={(v) => handleChange('contraseña', v)} type="password" />

        <SelectRol value={formulario.rol} onChange={(v) => handleChange('rol', v)} />

        {formulario.rol === 'vendedor' && (
          <>
            <InputArchivo label="Foto DPI Frente" name="fotoDPIFrente" />
            <InputArchivo label="Foto DPI Reverso" name="fotoDPIReverso" />
            <InputArchivo label="Selfie con DPI" name="selfieConDPI" />
            <InputArchivo label="Licencia de Conducir" name="licenciaConducir" />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Registrando...
            </>
          ) : 'Registrarse'}
        </button>

        <div className="text-center mt-4">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Error con Google')} />
        </div>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegistroPage;