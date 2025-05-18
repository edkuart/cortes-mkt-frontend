interface SelectRolProps {
  value: string;
  onChange: (value: string) => void;
  opciones?: { label: string; value: string }[]; // por si querés personalizar
}

const SelectRol = ({ value, onChange, opciones }: SelectRolProps) => {
  const opcionesDefecto = [
    { value: 'comprador', label: 'Comprador' },
    { value: 'vendedor', label: 'Vendedor' },
  ];

  const opcionesFinales = opciones || opcionesDefecto;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded w-full py-2 px-3 text-gray-700"
      >
        {opcionesFinales.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectRol;

  