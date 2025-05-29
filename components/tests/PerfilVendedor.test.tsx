// 📁 components/tests/PerfilVendedor.test.tsx

import { render, screen } from '@testing-library/react';
import PerfilVendedor from '@/pages/vendedor/perfil-vendedor/[id]';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { id: '123' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Test Vendedor', rol: 'vendedor' },
    token: 'fake-token',
    isAuthenticated: true,
  }),
}));

jest.mock('@/components/PerfilVendedor/InsigniasVendedor', () => () => <div>Mock Insignias</div>);
jest.mock('@/components/PerfilVendedor/MensajeRapidoForm', () => () => <div>Mock Form</div>);
jest.mock('@/components/PerfilVendedor/ResumenCalificacion', () => () => <div>Mock Resumen</div>);
jest.mock('@/components/PerfilVendedor/BotonesVendedor', () => () => <div>Mock Botones</div>);
jest.mock('@/components/PerfilVendedor/PaginadorProductos', () => () => <div>Mock Paginador</div>);
jest.mock('@/components/PerfilVendedor/ResenasRecientes', () => () => <div>Mock Resenas</div>);

// ✅ Mock global de fetch para pruebas

global.fetch = jest.fn((url: string) => {
  if (url.includes('/api/vendedores/')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          id: 123,
          nombreCompleto: 'Test Vendedor',
          productos: [],
          estado: 'aprobado',
          calificacionGlobal: 4,
        }),
    });
  }

  if (url.includes('/api/resenas/vendedor/')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve([
          { comentario: 'Muy buen producto', createdAt: '2025-05-01T00:00:00Z' },
          { comentario: 'Excelente atención', createdAt: '2025-05-02T00:00:00Z' },
        ]),
    });
  }

  return Promise.resolve({ json: () => Promise.resolve([]) });
}) as jest.Mock;

describe('PerfilVendedor', () => {
  it('muestra correctamente el perfil del vendedor', async () => {
    render(<PerfilVendedor />);
    expect(await screen.findByText(/Mock Insignias/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Botones/i)).toBeInTheDocument();
  });
});
