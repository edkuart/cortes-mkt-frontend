// 📄 components/tests/RegistroPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistroPage from '@/pages/registro';
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

describe('RegistroPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getInputByLabel = (label: RegExp) => {
    return screen.getAllByLabelText(label)[0];
  };

  it('permite registrarse con datos válidos', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Registro exitoso' }),
      })
    ) as jest.Mock;

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <RegistroPage />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Nuevo Usuario' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'usuario@ejemplo.com' },
    });
    fireEvent.change(getInputByLabel(/contraseña/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('muestra error si faltan campos requeridos', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <RegistroPage />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Corrige los errores antes de continuar.');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <RegistroPage />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Usuario Test' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'correo@test.com' },
    });
    fireEvent.change(getInputByLabel(/contraseña/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'diferente123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Corrige los errores antes de continuar.');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('redirige al login tras registro exitoso', async () => {
    const { useRouter } = require('next/router');
    const pushMock = useRouter().push;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Registro exitoso' }),
      })
    ) as jest.Mock;

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <RegistroPage />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Redireccionador' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'redir@correo.com' },
    });
    fireEvent.change(getInputByLabel(/contraseña/i), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('muestra error si ocurre un fallo en la red', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <RegistroPage />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Error Net' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'error@net.com' },
    });
    fireEvent.change(getInputByLabel(/contraseña/i), {
      target: { value: 'network123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'network123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo conectar con el servidor');
    });
  });
});
