// 📁 services/apiClient.ts

export const crearProducto = async (formData: FormData, token: string) => {
    const response = await fetch('http://localhost:4000/api/productos', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData, // no agregamos Content-Type, lo gestiona FormData automáticamente
    });
  
    if (!response.ok) {
      throw new Error('Error al crear producto');
    }
  
    return response.json();
  };
  