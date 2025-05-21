// 📁 frontend/services/actividadService.ts

export async function obtenerPedidosComprador(compradorId: number) {
  try {
    const res = await fetch(`http://localhost:4000/api/pedidos/comprador/${compradorId}`);
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return await res.json();
  } catch (error) {
    console.error('❌ Error en obtenerPedidosComprador:', error);
    throw error;
  }
}

export async function obtenerResenasComprador(compradorId: number) {
  try {
    const res = await fetch(`http://localhost:4000/api/resenas/comprador/${compradorId}`);
    if (!res.ok) throw new Error('Error al obtener reseñas');
    return await res.json();
  } catch (error) {
    console.error('❌ Error en obtenerResenasComprador:', error);
    throw error;
  }
}