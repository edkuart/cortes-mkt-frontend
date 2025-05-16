// 📦 utils/filtros.ts

export interface ProductoConPromedio {
    id: number;
    nombre: string;
    promedioCalificacion?: number | null;
  }
  
  export function filtrarPorCalificacion(
    productos: ProductoConPromedio[],
    filtro: string
  ): ProductoConPromedio[] {
    return productos.filter((p) => {
      const promedio = p.promedioCalificacion ?? 0;
  
      if (filtro === '5') return promedio === 5;
      if (filtro === '4mas') return promedio >= 4;
      if (filtro === '3menos') return promedio <= 3;
  
      return true; // 'todas'
    });
  }
  