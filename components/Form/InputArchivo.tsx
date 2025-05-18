import React from 'react';

interface Props {
  label: string;
  name: string;
  onChange: (field: string, value: File | null) => void;
}

const InputArchivo: React.FC<Props> = ({ label, name, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type="file"
        className="w-full"
        onChange={(e) => onChange(name, e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default InputArchivo;