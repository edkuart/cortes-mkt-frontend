export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'vendedor' | 'comprador';
  estado: 'activo' | 'bloqueado';
  createdAt?: string;

  totalProductos?: number;
  promedioCalificacion?: number;
  totalResenas?: number;
}

export interface VendedorDetalle {
  id: number;
  nombre: string;
  promedioCalificacion: number | null;
  totalResenas: number;
  totalProductos: number;
  totalReportes: number;
}  