// 📦 components/ConfirmModal.tsx

import { useState } from 'react';

interface Props {
  mensaje: string;
  onConfirmar: () => void;
  textoBoton?: string;
}

export default function ConfirmModal({ mensaje, onConfirmar, textoBoton = 'Eliminar' }: Props) {
  const [abierto, setAbierto] = useState(false);

  const confirmar = () => {
    setAbierto(false);
    onConfirmar();
  };

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
      >
        {textoBoton}
      </button>

      {abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-80">
            <p className="text-sm text-gray-800">{mensaje}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAbierto(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
