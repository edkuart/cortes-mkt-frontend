// 📁 components/tests/MensajeNuevo.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NuevoMensajePage from '@/pages/mensajes/nuevo';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Usuario Test' },
    token: 'fake-token'
  })
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mensaje: 'Mensaje enviado correctamente' })
  })
) as jest.Mock;

describe('MensajeNuevoPage', () => {
  it('envía un mensaje correctamente y redirige a /mensajes', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { para: '2', nombre: 'Destinatario Test' },
      push: jest.fn()
    });

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <NuevoMensajePage />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    const textarea = screen.getByPlaceholderText('Escribe tu mensaje...');
    fireEvent.change(textarea, { target: { value: 'Hola, este es un mensaje de prueba.' } });

    const boton = screen.getByRole('button', { name: /enviar mensaje/i });
    fireEvent.click(boton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/mensajes', expect.any(Object));
    });
  });
});

