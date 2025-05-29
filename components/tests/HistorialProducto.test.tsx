// 📁 components/tests/HistorialProducto.test.tsx

import { render, screen } from '@testing-library/react';
import HistorialProductoPage from '@/pages/productos/historial/[id]';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { id: '42' } }),
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          descripcion: 'Cambio de precio',
          valorAnterior: 'Q100.00',
          valorNuevo: 'Q120.00',
          fecha: '2025-05-25T00:00:00Z',
        },
      ]),
  })
) as jest.Mock;

describe('HistorialProductoPage', () => {
  it('renderiza correctamente el historial del producto', async () => {
    render(<HistorialProductoPage />);

    expect(
      await screen.findByText(/historial de cambios del producto #42/i)
    ).toBeInTheDocument();

    // Verificamos fragmentos clave del historial
    expect(await screen.findByText(/cambio:/i)).toBeInTheDocument();
    expect(screen.getByText('Q100.00')).toBeInTheDocument();
    expect(screen.getByText('Q120.00')).toBeInTheDocument();
  });
});


