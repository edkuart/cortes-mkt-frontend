// 📁 components/tests/ProductoEditar.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditarProductoPage from '@/pages/productos/editar/[id]';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { id: '42' },
    push: jest.fn()
  })
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Vendedor de prueba' },
    token: 'fake-token',
    isAuthenticated: () => true,
  })
}));

jest.mock('@/components/ProductoForm', () => ({
  __esModule: true,
  default: ({ onSubmit, productoEditar }: any) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('nombre', productoEditar?.nombre || 'Editado');
      onSubmit(formData);
    }}>
      <button type="submit" aria-label="Actualizar producto">Actualizar producto</button>
    </form>
  )
}));

global.fetch = jest.fn((url, options) => {
  if (url.includes('/api/productos/42') && options?.method === 'PATCH') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ mensaje: 'Actualizado' })
    });
  }
  if (url.includes('/api/productos/42')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 42,
        nombre: 'Producto original',
        precio: 50,
        descripcion: 'Producto previo',
        stock: 5,
        categoria: 'corte',
      }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
}) as jest.Mock;

describe('EditarProductoPage', () => {
  it('envía los cambios del producto y redirige al historial', async () => {
    await waitFor(() => {
      render(
        <GoogleOAuthProvider clientId="test-client-id">
          <AuthProvider>
            <EditarProductoPage />
          </AuthProvider>
        </GoogleOAuthProvider>
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /actualizar producto/i }));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/productos/42', expect.objectContaining({
        method: 'PATCH',
      }));
    });
  });
});

