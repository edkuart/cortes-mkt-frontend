// components/SolicitarDevolucion.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  pedidoId: number;
}

export default function SolicitarDevolucion({ pedidoId }: Props) {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) {
      toast.error('Debes ingresar un motivo');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('http://localhost:4000/api/devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, pedidoId }),
      });

      if (res.ok) {
        toast.success('Solicitud enviada correctamente');
        setMotivo('');
      } else {
        toast.error('Error al enviar la solicitud');
      }
    } catch (error) {
      toast.error('No se pudo conectar al servidor');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4 max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-semibold">📤 Solicitar devolución</h2>
      <p className="text-sm text-gray-500">Motivo:</p>
      <textarea
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        rows={4}
        className="w-full border rounded p-2 text-sm"
        placeholder="Escribe el motivo de la devolución..."
      />
      <button
        type="submit"
        disabled={enviando}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}