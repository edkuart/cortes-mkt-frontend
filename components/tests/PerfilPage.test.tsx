// 📁 components/tests/PerfilPage.test.tsx

import { render, screen } from '@testing-library/react';
import PerfilPage from '@/pages/perfil';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/hooks/useAuth', () => {
  return {
    useAuth: () => {
      // Para evitar el ciclo infinito en el componente PerfilPage,
      // asegurate de que el useEffect en ese componente solo se ejecute una vez.
      // Podés usar una condición como: if (user && formData.nombreCompleto === '')
      return {
        user: {
          id: 1,
          nombre: 'Juan Pérez',
          correo: 'juan@example.com',
          rol: 'comprador',
          estado: 'aprobado',
          fotoPerfil: '',
        },
        token: 'fake-token',
      };
    }
  };
});

describe('PerfilPage', () => {
  it('renderiza el título del perfil sin ciclo infinito', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <PerfilPage />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
  });
});
