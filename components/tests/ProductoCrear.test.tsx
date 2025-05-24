// 📁 components/tests/ProductoCrear.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearProductoPage from '@/pages/productos/crear';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Test Vendedor' },
    token: 'fake-token',
    isAuthenticated: () => true
  })
}));

jest.mock('@/components/ProductoForm', () => ({
  __esModule: true,
  default: ({ onSubmit }: any) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('nombre', 'Producto de prueba');
      formData.append('precio', '100');
      formData.append('stock', '10');
      formData.append('descripcion', 'Descripción de prueba');
      onSubmit(formData);
    }}>
      <button type="submit" aria-label="Agregar producto">Agregar producto</button>
    </form>
  )
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mensaje: 'Producto agregado' })
  })
) as jest.Mock;

describe('CrearProductoPage', () => {
  it('permite crear un nuevo producto y redirige al historial', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <CrearProductoPage />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/productos', expect.any(Object));
    });
  });
});
