// 📁 components/Form/InputText.tsx

interface InputTextProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
  }
  
  const InputText = ({ label, value, onChange, type = 'text', required = true }: InputTextProps) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
        required={required}
      />
    </div>
  );
  
  export default InputText;