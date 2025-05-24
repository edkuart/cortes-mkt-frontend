// 📁 components/tests/ProductoVista.test.tsx

import { render, screen } from '@testing-library/react';
import ProductoVista from '../ProductoVista';

const mockProducto = {
  id: 1,
  nombre: 'Corte típico azul',
  descripcion: 'Tela de alta calidad para trajes típicos.',
  precio: 150,
  imagen: '/corte-azul.jpg',
  categoria: 'Cortes',
  promedioCalificacion: 4.5,
  vendedorId: 7,
  reseñas: [
    {
      id: 1,
      comentario: 'Muy buen producto',
      calificacion: 5,
      comprador: { nombreCompleto: 'Juan Pérez' },
    },
  ],
};

describe('ProductoVista', () => {
  it('muestra el nombre, descripción y precio del producto', () => {
    render(<ProductoVista producto={mockProducto} />);

    expect(screen.getByText('Corte típico azul')).toBeInTheDocument();
    expect(screen.getByText('Tela de alta calidad para trajes típicos.')).toBeInTheDocument();
    expect(screen.getByText(/Q150/)).toBeInTheDocument();
  });

  it('muestra las reseñas correctamente', () => {
    render(<ProductoVista producto={mockProducto} />);

    expect(screen.getByText('Muy buen producto')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('⭐ 5 / 5')).toBeInTheDocument();
  });
});
