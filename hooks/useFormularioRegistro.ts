// 📁 hooks/useFormularioRegistro.ts

import { useState } from 'react';
import { FormularioRegistro } from '@/types/registro'; // ajusta la ruta si es necesario

export const useFormularioRegistro = () => {
  const [formulario, setFormulario] = useState<FormularioRegistro>({
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    confirmarContrasena: '',
    rol: 'comprador',
    fotoDPIFrente: null,
    fotoDPIReverso: null,
    selfieConDPI: null,
    licenciaConducir: null,
  });

  const handleChange = <K extends keyof FormularioRegistro>(
    campo: K,
    valor: FormularioRegistro[K]
  ) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  return { formulario, setFormulario, handleChange };
};
