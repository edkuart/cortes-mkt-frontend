// 📁 components/tests/MensajesChat.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ChatConVendedor from '@/pages/mensajes/[id]';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock scrollIntoView que no está implementado en jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { id: 2 },
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Usuario Test' },
    token: 'fake-token'
  })
}));

jest.mock('@/context/MensajesContext', () => ({
  useMensajesContext: () => ({
    setHayNoLeidos: jest.fn()
  })
}));

jest.mock('@/hooks/useVerificarMensajes', () => ({
  useVerificarMensajesNoLeidos: () => () => {}
}));

global.fetch = jest.fn() as jest.Mock;

(global.fetch as jest.Mock).mockImplementation((url, options) => {
  // Simula el fetch inicial al cargar la conversación con el vendedor
  if (url.includes('/api/mensajes/2?usuarioId=1')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          emisorId: 1,
          receptorId: 2,
          contenido: 'Mensaje de prueba',
          createdAt: new Date().toISOString(),
        }
      ]),
    });
  }

  // Simula el POST de un nuevo mensaje
  if (options?.method === 'POST') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 123,
        emisorId: 1,
        receptorId: 2,
        contenido: 'Mensaje de prueba',
        createdAt: new Date().toISOString(),
      })
    });
  }

  // Cualquier otro fetch
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  });
});

describe('MensajeNuevoPage', () => {
  it('envía un mensaje correctamente y lo muestra en pantalla', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <ChatConVendedor />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/escribe tu mensaje/i), {
      target: { value: 'Mensaje de prueba' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    const mensaje = await screen.findByText(/mensaje de prueba/i);
    expect(mensaje).toBeInTheDocument();
  });
});


