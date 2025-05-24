// 📁 components/tests/MensajesIndex.test.tsx

import { render, screen } from '@testing-library/react';
import BandejaMensajes from '@/pages/mensajes/index';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Usuario Test' },
    token: 'fake-token'
  })
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        id: 1,
        participante: {
          id: 2,
          nombreCompleto: 'Destinatario Test',
          fotoUrl: '/placeholder.jpg'
        },
        ultimoMensaje: 'Hola, ¿cómo estás?',
        fecha: new Date().toISOString()
      }
    ])
  })
) as jest.Mock;

describe('MensajesIndexPage', () => {
  it('muestra las conversaciones correctamente', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <BandejaMensajes />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    expect(await screen.findByText('Destinatario Test')).toBeInTheDocument();
    expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument();
  });
});
