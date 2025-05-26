// 📁 components/PerfilVendedor/ResumenCalificacion.tsx

import Estrellas from '@/components/Estrellas';

export default function ResumenCalificacion({ calificacion }: { calificacion: number }) {
  return (
    <div className="mt-4 text-center">
      <Estrellas calificacion={calificacion} />
      <p className="text-sm text-gray-500 mt-1">Calificación global promedio</p>
    </div>
  );
}
