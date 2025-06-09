export interface FormularioRegistro {
  nombre: string;
  correo: string;
  password: string;
  confirmarPassword: string;
  rol: 'comprador' | 'vendedor';
}
