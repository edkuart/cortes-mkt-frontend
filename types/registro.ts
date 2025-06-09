export interface FormularioRegistro {
  nombreCompleto: string;
  correo: string;
  contraseña: string;
  confirmarContrasena: string;
  rol: 'comprador' | 'vendedor';
  fotoDPIFrente?: File | null;
  fotoDPIReverso?: File | null;
  selfieConDPI?: File | null;
  licenciaConducir?: File | null;
}
