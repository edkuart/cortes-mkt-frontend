// 📁 pages/perfil.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InputText from '@/components/Form/InputText';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const PerfilPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const token = auth?.token;

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    nuevaContraseña: '',
    rol: '',
    fotoPerfil: null as File | null,
  });

  const [formOriginal, setFormOriginal] = useState({
    nombreCompleto: '',
    correo: '',
    rol: '',
    fotoPerfilUrl: '',
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [borrarFoto, setBorrarFoto] = useState(false);
  const [exitoVisual, setExitoVisual] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombre,
        correo: user.correo,
        nuevaContraseña: '',
        rol: user.rol,
        fotoPerfil: null,
      });

      const fotoUrl = (user as any).fotoUrl || `http://localhost:4000/${(user as any).fotoPerfil || ''}`;

      setFormOriginal({
        nombreCompleto: user.nombre,
        correo: user.correo,
        rol: user.rol,
        fotoPerfilUrl: fotoUrl,
      });

      setPreview(fotoUrl);
    }
  }, [user]);

  const handleChange = (campo: string, valor: any) => {
    if (campo === 'fotoPerfil') {
      if (valor instanceof File) {
        const tipoPermitido = ['image/jpeg', 'image/png', 'image/jpg'];
        const tamañoMaximo = 2 * 1024 * 1024;

        if (!tipoPermitido.includes(valor.type)) {
          toast.error('Formato inválido. Solo se permiten JPG y PNG.');
          return;
        }

        if (valor.size > tamañoMaximo) {
          toast.error('La imagen es muy grande. Máximo 2MB.');
          return;
        }

        const url = URL.createObjectURL(valor);
        setPreview(url);
        setFormData(prev => ({ ...prev, fotoPerfil: valor }));
        setBorrarFoto(false);
      } else if (valor === null) {
        setPreview(null);
        setFormData(prev => ({ ...prev, fotoPerfil: null }));
        setBorrarFoto(true);
      }
    } else {
      setFormData(prev => ({ ...prev, [campo]: valor }));
    }
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.nuevaContraseña && formData.nuevaContraseña.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setGuardando(true);
      const form = new FormData();
      form.append('nombreCompleto', formData.nombreCompleto);
      form.append('correo', formData.correo);
      if (formData.nuevaContraseña) form.append('nuevaContraseña', formData.nuevaContraseña);
      if (formData.fotoPerfil) form.append('fotoPerfil', formData.fotoPerfil);
      if (borrarFoto) form.append('borrarFoto', 'true');

      const res = await fetch(`http://localhost:4000/api/usuarios/${user?.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.mensaje || 'Error al actualizar');
        return;
      }

      toast.success('Perfil actualizado');
      setEditando(false);
      setExitoVisual(true);
      setTimeout(() => setExitoVisual(false), 3000);
    } catch (error) {
      toast.error('No se pudo actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarImagen = () => {
    setPreview(null);
    setFormData(prev => ({ ...prev, fotoPerfil: null }));
    setBorrarFoto(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleActualizar} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Mi Perfil</h2>
        <p className="text-center text-gray-600 mb-4">
          {formData.rol === 'vendedor' ? '🛍 Vendedor' : '🛒 Comprador'}
          {(user as any)?.estado === 'aprobado' && (
            <span className="ml-2 inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Aprobado</span>
          )}
        </p>

        {exitoVisual && (
          <div className="mb-4 flex items-center justify-center text-green-600 animate-fade-in">
            <span className="text-xl mr-2">✅</span> Cambios guardados correctamente.
          </div>
        )}

        {preview ? (
          <div className="text-center">
            <img
              src={preview}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border"
            />
          </div>
        ) : (
          <p className="text-sm text-center text-gray-500 mb-4">No has subido foto aún.</p>
        )}

        <InputText
          label="Nombre completo"
          value={formData.nombreCompleto}
          onChange={(v) => handleChange('nombreCompleto', v)}
          required
        />

        <InputText
          label="Correo electrónico"
          value={formData.correo}
          onChange={(v) => handleChange('correo', v)}
          type="email"
          required
        />

        <InputText
          label="Nueva contraseña (opcional)"
          value={formData.nuevaContraseña}
          onChange={(v) => handleChange('nuevaContraseña', v)}
          type="password"
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const archivo = e.dataTransfer.files?.[0];
            if (archivo) handleChange('fotoPerfil', archivo);
          }}
          className="mb-4 w-full border-2 border-dashed border-gray-300 p-4 rounded text-center cursor-pointer hover:bg-gray-100"
        >
          <p className="text-sm text-gray-500 mb-2">Arrastra tu imagen aquí o haz clic para subir</p>
          <input
            type="file"
            onChange={(e) => handleChange('fotoPerfil', e.target.files?.[0] || null)}
            className="w-full"
          />
          {preview && (
            <button
              type="button"
              onClick={handleEliminarImagen}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Eliminar imagen de perfil
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
          <input
            type="text"
            value={formData.rol}
            disabled
            className="w-full bg-gray-100 text-gray-600 border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-jade hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button
          type="button"
          onClick={() => {
            setEditando(false);
            setFormData(prev => ({
              ...prev,
              nombreCompleto: formOriginal.nombreCompleto,
              correo: formOriginal.correo,
              rol: formOriginal.rol,
              nuevaContraseña: '',
              fotoPerfil: null,
            }));
            setPreview(formOriginal.fotoPerfilUrl);
            setBorrarFoto(false);
          }}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default PerfilPage;