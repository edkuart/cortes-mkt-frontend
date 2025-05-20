// 📁 hooks/useFormularioRegistro.ts

import { useState } from 'react';

export const useFormularioRegistro = () => {
  const [formulario, setFormulario] = useState({
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    confirmarContrasena: '',
    rol: 'comprador',
    fotoDPIFrente: null as File | null,
    fotoDPIReverso: null as File | null,
    selfieConDPI: null as File | null,
    licenciaConducir: null as File | null,
  });

  const handleChange = (campo: string, valor: any) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  return { formulario, setFormulario, handleChange };
};