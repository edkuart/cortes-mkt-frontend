// 📄 components/tests/PerfilPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PerfilPage from '@/pages/perfil';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      rol: 'comprador',
      estado: 'aprobado',
      fotoPerfil: '',
    },
    token: 'fake-token',
  }),
}));

jest.mock('react-hot-toast', () => {
  const errorMock = jest.fn();
  const successMock = jest.fn();
  const toast = { error: errorMock, success: successMock };
  return {
    __esModule: true,
    default: toast,
    toast,
  };
});

describe('PerfilPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('permite cambiar nombre y enviar el formulario', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Perfil actualizado' }),
      })
    ) as jest.Mock;

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <PerfilPage />
      </GoogleOAuthProvider>
    );

    const inputNombre = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(inputNombre, { target: { value: 'Nuevo Nombre' } });

    const form = screen.getByTestId('form-perfil');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/cambios guardados correctamente/i)).toBeInTheDocument();
    });

    console.log((global.fetch as jest.Mock).mock.calls);
  });

  it('muestra error si el servidor responde con error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ mensaje: 'Error del servidor' }),
      })
    ) as jest.Mock;

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <PerfilPage />
      </GoogleOAuthProvider>
    );

    const inputNombre = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(inputNombre, { target: { value: 'Nombre con error' } });

    const form = screen.getByTestId('form-perfil');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error del servidor');
    });
  });

  it('muestra error si la contraseña es menor a 6 caracteres', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <PerfilPage />
      </GoogleOAuthProvider>
    );

    const inputContrasena = screen.getByLabelText(/nueva contraseña/i);
    fireEvent.change(inputContrasena, { target: { value: '123' } });

    const form = screen.getByTestId('form-perfil');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('La contraseña debe tener al menos 6 caracteres.');
    });
  });

  it('restaura los datos originales al hacer clic en Cancelar', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <PerfilPage />
      </GoogleOAuthProvider>
    );

    const inputNombre = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(inputNombre, { target: { value: 'Cambio temporal' } });

    const botonCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(botonCancelar);

    await waitFor(() => {
      expect((screen.getByLabelText(/nombre completo/i) as HTMLInputElement).value).toBe('Juan Pérez');
    });
  });
});
