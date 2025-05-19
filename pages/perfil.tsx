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

  const [preview, setPreview] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [borrarFoto, setBorrarFoto] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombre,
        correo: user.correo,
        nuevaContraseña: '',
        rol: user.rol,
        fotoPerfil: null,
      });

      if ((user as any).fotoPerfilUrl) {
        setPreview((user as any).fotoPerfilUrl);
      } else if ((user as any).fotoPerfil) {
        setPreview(`http://localhost:4000/${(user as any).fotoPerfil}`);
      }
    }
  }, [user]);

  const handleChange = (campo: string, valor: any) => {
    if (campo === 'fotoPerfil') {
      if (valor instanceof File) {
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
    try {
      const form = new FormData();
      form.append('nombreCompleto', formData.nombreCompleto);
      form.append('correo', formData.correo);
      if (formData.nuevaContraseña) form.append('nuevaContraseña', formData.nuevaContraseña);
      if (formData.fotoPerfil) {
        form.append('fotoPerfil', formData.fotoPerfil);
      }
      if (borrarFoto) {
        form.append('borrarFoto', 'true');
      }

      const res = await fetch(`http://localhost:4000/api/usuarios/${user?.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.mensaje || 'Error al actualizar');
        return;
      }

      toast.success('Perfil actualizado');
      setEditando(false);
    } catch (error) {
      toast.error('No se pudo actualizar el perfil');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h2>

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
          required={false}
        />

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Foto de perfil (opcional)</label>
          <input
            type="file"
            onChange={(e) => handleChange('fotoPerfil', e.target.files?.[0] || null)}
            className="w-full"
          />
          {preview ? (
            <div className="text-center">
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 h-24 w-24 object-cover rounded-full mx-auto border"
              />
              <button
                type="button"
                onClick={handleEliminarImagen}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Eliminar imagen de perfil
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">No se ha cargado una foto de perfil.</p>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!editando}
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={() => setEditando(!editando)}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          {editando ? 'Cancelar' : 'Editar perfil'}
        </button>
      </form>
    </div>
  );
};

export default PerfilPage;