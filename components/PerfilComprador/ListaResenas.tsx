//📁 components/PerfilComprador/ListaResenas.tsx

import ResenaConRespuesta from '@/components/ResenaConRespuesta';

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  respuestaVendedor?: string;
  Comprador?: {
    nombreCompleto: string;
  };
  Producto?: {
    id: number;
    nombre: string;
  };
}

interface Props {
  resenas: Resena[];
  actualizarRespuesta: (id: number, respuesta: string) => void;
}

export default function ListaResenas({ resenas, actualizarRespuesta }: Props) {
  if (resenas.length === 0) {
    return <p className="text-gray-500">No hay reseñas para este filtro.</p>;
  }

  return (
    <ul className="space-y-3">
      {resenas.map((r) => (
        <li key={r.id}>
          <ResenaConRespuesta resena={r} onRespuestaGuardada={actualizarRespuesta} />
        </li>
      ))}
    </ul>
  );
}