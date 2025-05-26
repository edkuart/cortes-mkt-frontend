// 📁 components/Form/InputText.tsx

interface InputTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}

const InputText = ({ label, value, onChange, type = 'text', required = true, error }: InputTextProps) => {
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
          error ? 'border-red-500' : ''
        }`}
        required={required}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputText;