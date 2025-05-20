// 📁 pages/mensajes/nuevo.tsx

import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FondoAnimado from '@/components/FondoAnimado';
import TarjetaGlass from '@/components/TarjetaGlass';
import InputText from '@/components/Form/InputText';
import toast from 'react-hot-toast';

const NuevoMensajePage = () => {
  const router = useRouter();
  const { para, nombre } = router.query;
  const { user, token } = useAuth();

  const [contenido, setContenido] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return toast.error('El mensaje no puede estar vacío.');
    if (!user || !token || !para) return toast.error('Debe iniciar sesión.');

    setEnviando(true);
    try {
      const res = await fetch('http://localhost:4000/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paraId: Number(para),
          contenido,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.mensaje || 'Error al enviar el mensaje');
        return;
      }

      toast.success('Mensaje enviado correctamente');
      router.push('/mensajes');
    } catch (err) {
      toast.error('No se pudo enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FondoAnimado>
      <div className="min-h-screen flex items-center justify-center p-4">
        <TarjetaGlass className="w-full max-w-lg p-6">
          <h1 className="text-2xl font-bold mb-4">📩 Nuevo mensaje</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enviando a: <span className="font-medium text-jade">{nombre}</span>
          </p>
          <form onSubmit={enviarMensaje} className="space-y-4">
          <textarea
            className="w-full border rounded px-3 py-2"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe tu mensaje..."
            rows={4}
            />
            <button
              type="submit"
              disabled={enviando}
              className="bg-jade text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </TarjetaGlass>
      </div>
    </FondoAnimado>
  );
};

export default NuevoMensajePage;