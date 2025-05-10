// 📁 pages/ia.tsx
import React, { useState } from 'react';
import IAResponseBox from '../components/IAResponseBox';

const PaginaIA = () => {
  const [prompt, setPrompt] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async () => {
    if (!prompt.trim()) return;
    setCargando(true);
    setRespuesta('');

    try {
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setRespuesta(data.respuesta || '⚠️ Error: No se recibió respuesta de la IA');
    } catch (error) {
      console.error('❌ Error al conectar con la IA:', error);
      setRespuesta('❌ Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <IAResponseBox
        prompt={prompt}
        setPrompt={setPrompt}
        respuesta={respuesta}
        cargando={cargando}
        onSubmit={manejarEnvio}
      />
    </main>
  );
};

export default PaginaIA;
