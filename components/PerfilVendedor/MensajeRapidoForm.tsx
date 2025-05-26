// 📁 components/PerfilVendedor/MensajeRapidoForm.tsx

import { useState } from 'react';

interface Props {
  onSubmit: (mensaje: string) => Promise<void>;
}

export default function MensajeRapidoForm({ onSubmit }: Props) {
  const [contenido, setContenido] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    await onSubmit(contenido);
    setContenido('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-bold mb-1">Mensaje rápido</label>
      <textarea
        className="w-full border rounded px-3 py-2"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Escribe tu mensaje..."
        rows={4}
        required
      />
      <button
        type="submit"
        className="bg-jade text-white px-4 py-2 rounded hover:bg-green-700 transition"
        disabled={!contenido.trim()}
      >
        Enviar mensaje
      </button>
    </form>
  );
}