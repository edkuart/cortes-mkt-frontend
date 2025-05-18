// 🧩 components/ReseñasBox.tsx

import { useEffect, useState } from 'react';

interface Reseña {
  id: number;
  comentario: string;
  calificacion: number;
  compradorId: number;
  createdAt: string;
  respuestaVendedor?: string;
}

interface Props {
  productoId: number;
  compradorId: number;
  vendedorId: number;
  pedidoId: number;
  token: string;
}

const ReseñasBox = ({ productoId, compradorId, vendedorId, pedidoId, token }: Props) => {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [yaOpino, setYaOpino] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/reseñas/producto/${productoId}`)
      .then((res) => res.json())
      .then((data) => {
        setReseñas(data);
        setYaOpino(data.some((r: Reseña) => r.compradorId === compradorId));
      });
  }, [productoId, compradorId]);

  const enviarReseña = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/reseñas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendedorId,
          productoId,
          pedidoId,
          comentario,
          calificacion
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setReseñas((prev) => [...prev, json.resena]);
        setYaOpino(true);
        setComentario('');
        setCalificacion(5);
      } else {
        console.error("❌ Error:", json.mensaje);
      }
    } catch (err) {
      console.error('Error al enviar reseña:', err);
    }
  };

  return (
    <div className="border rounded p-4 mt-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Reseñas</h3>
      {reseñas.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no hay reseñas.</p>
      ) : (
        <ul className="space-y-2">
          {reseñas.map((r) => (
            <li key={r.id} className="border p-2 rounded bg-gray-50">
              <p className="text-sm">⭐ {r.calificacion} - {r.comentario}</p>
              <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              {r.respuestaVendedor && (
                <div className="mt-1 text-sm text-indigo-700 bg-indigo-50 border-l-4 border-indigo-400 pl-2">
                  <strong>Respuesta:</strong> {r.respuestaVendedor}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!yaOpino && (
        <div className="mt-4">
          <textarea
            placeholder="Deja tu reseña..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            rows={3}
          />
          <select
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            className="border rounded p-1 mb-2"
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>{val} estrellas</option>
            ))}
          </select>
          <button
            onClick={enviarReseña}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enviar reseña
          </button>
        </div>
      )}
    </div>
  );
};

export default ReseñasBox;
