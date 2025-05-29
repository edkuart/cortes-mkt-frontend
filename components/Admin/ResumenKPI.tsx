// 📁 frontend/components/Admin/ResumenKPI.tsx

import { ReactNode } from 'react';

type Props = {
  titulo: string;
  valor: number;
  icono: ReactNode;
  color: string;
};

const ResumenKPI = ({ titulo, valor, icono, color }: Props) => {
  return (
    <div className={`p-6 rounded-2xl shadow-md ${color} flex items-center justify-between`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
        <p className="text-2xl font-bold text-gray-900">{valor}</p>
      </div>
      <div className="text-3xl">
        {icono}
      </div>
    </div>
  );
};

export default ResumenKPI;
