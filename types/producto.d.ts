// 📁 frontend/types/producto.d.ts

export type ProductoConPromedio = {
    id: number;
    nombre: string;
    precio: number;
    imagen?: string;
    promedioCalificacion?: number;
    vendedorId: number;
  };
  
  export interface ProductoCardProps extends ProductoConPromedio {
    onEditar?: (id: number) => void;
    onEliminar?: (id: number) => void;
    destacado?: boolean;
    filtroTipo?: string;
  }
  
  
  
  