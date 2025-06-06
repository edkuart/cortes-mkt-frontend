// 📁 frontend/types/admin.ts

export interface Usuario {
  id: number;
  nombreCompleto: string; // Usaremos nombreCompleto consistentemente
  correo: string;
  rol: 'admin' | 'vendedor' | 'comprador' | string;
  estado: 'activo' | 'bloqueado';
  createdAt?: string; // Fecha de registro, backend la envía como parte de timestamps: true
  
  // Campos opcionales específicos para vendedores que podrían venir del backend
  // o ser calculados para mostrar en el modal de detalle de TablaUsuarios
  totalProductos?: number;
  promedioCalificacion?: number;
  totalResenas?: number;
}

export interface Reporte {
  id: number;
  tipo: 'producto' | 'reseña' | 'mensaje';
  motivo: string;
  contenidoId: number;
  descripcion?: string;
  estado: 'pendiente' | 'resuelto';
  createdAt: string;
  usuario: { 
    nombreCompleto: string; 
    correo: string;
  };
}

export interface VendedorDetalle { 
  id: number; 
  nombre: string; // Asumimos que este 'nombre' es el 'nombreCompleto' del Vendedor/Usuario
  promedioCalificacion: number;
  totalResenas: number;
  totalProductos: number;
  totalReportes: number;
}

// ... otros tipos que necesites ...