// 📁 components/IAResponseBox.tsx

import React from "react";

interface IAResponseBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  respuesta: string;
  cargando: boolean;
  onSubmit: () => void;
}

const IAResponseBox: React.FC<IAResponseBoxProps> = ({
  prompt,
  setPrompt,
  respuesta,
  cargando,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Escribe una pregunta para la IA..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {cargando ? "Cargando..." : "Preguntar a la IA"}
        </button>
      </form>

      {respuesta && (
        <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
            Respuesta de la IA:
          </h3>
          <p className="text-gray-900 dark:text-white whitespace-pre-line">{respuesta}</p>
        </div>
      )}
    </div>
  );
};

export default IAResponseBox;

