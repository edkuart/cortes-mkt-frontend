// 📁 utils/validarRegistro.ts

const validarRegistro = (formulario: any): { [key: string]: string } => {
    const errores: { [key: string]: string } = {};
  
    if (!formulario.nombreCompleto.trim()) errores.nombreCompleto = 'Campo obligatorio';
    if (!formulario.correo.includes('@')) errores.correo = 'Correo inválido';
    if (formulario.contraseña.length < 6) errores.contraseña = 'Mínimo 6 caracteres';
    if (formulario.contraseña !== formulario.confirmarContrasena) errores.confirmarContrasena = 'No coinciden';
  
    if (formulario.rol === 'vendedor') {
      if (!formulario.fotoDPIFrente) errores.fotoDPIFrente = 'Requerido';
      if (!formulario.fotoDPIReverso) errores.fotoDPIReverso = 'Requerido';
      if (!formulario.selfieConDPI) errores.selfieConDPI = 'Requerido';
      if (!formulario.licenciaConducir) errores.licenciaConducir = 'Requerido';
    }
  
    return errores;
  };
  
  export default validarRegistro;  