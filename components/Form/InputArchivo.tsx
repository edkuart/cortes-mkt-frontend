// 📁 components/Form/InputArchivo.tsx

import React from 'react';

interface Props {
  label: string;
  name: string;
  onChange: (field: string, value: File | null) => void;
  error?: string;
}

const InputArchivo: React.FC<Props> = ({ label, name, onChange, error }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type="file"
        className={`w-full text-sm ${error ? 'border border-red-500' : ''}`}
        onChange={(e) => onChange(name, e.target.files?.[0] || null)}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputArchivo;