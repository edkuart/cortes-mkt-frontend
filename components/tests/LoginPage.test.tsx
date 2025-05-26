// 📄 components/tests/LoginPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/pages/login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

jest.mock('next/router', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push }),
    __esModule: true,
    push,
  };
});

jest.mock('react-hot-toast', () => {
  const toast = { error: jest.fn(), success: jest.fn() };
  return {
    __esModule: true,
    default: toast,
    toast,
  };
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: jest.fn() })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <LoginPage />
      </GoogleOAuthProvider>
    );

  it('realiza login exitoso con correo y contraseña', async () => {
    const mockUsuario = { id: 1, nombre: 'Juan', rol: 'comprador' };
    const { useRouter } = require('next/router');
    const pushMock = useRouter().push;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ usuario: mockUsuario, token: 'abc123' }),
      })
    ) as jest.Mock;

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'correo@valido.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/login',
        expect.any(Object)
      );
      expect(pushMock).toHaveBeenCalledWith('/bienvenida');
    });
  });

  it('muestra error si los campos son inválidos', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'correo_invalido' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled(); // el error se muestra como texto, no toast
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('muestra mensaje de error si la contraseña es incorrecta', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ mensaje: 'Credenciales incorrectas' }),
      })
    ) as jest.Mock;

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@ejemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'incorrecta' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciales incorrectas');
    });
  });

  it('muestra error si hay fallo de conexión con el servidor', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Error de red'))) as jest.Mock;

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'user@ejemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo conectar con el servidor');
    });
  });
});
