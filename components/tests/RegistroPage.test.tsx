// 📁 components/tests/RegistroPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistroPage from '@/pages/registro';
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
  useAuth: () => ({ login: jest.fn() })
}));

jest.mock('@/hooks/useFormularioRegistro', () => {
  const React = require('react');
  const defaultFormulario = {
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    confirmarContrasena: '',
    rol: 'comprador',
  };
  return {
    useFormularioRegistro: () => {
      const [formulario, setFormulario] = React.useState(defaultFormulario);
      const handleChange = (campo: string, valor: string) =>
        setFormulario((prev: Record<string, string>) => ({
          ...prev,
          [campo]: valor,
        }));
      return { formulario, handleChange };
    }
  };
});

jest.mock('@/hooks/usePasswordStrength', () => () => ({
  nivel: 'Buena',
  color: 'bg-blue-400',
  porcentaje: '60%'
}));

jest.mock('@/components/Form/InputText', () => ({
  __esModule: true,
  default: ({ label, value, onChange }: any) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  )
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mensaje: 'Usuario registrado' })
  })
) as jest.Mock;

describe('RegistroPage', () => {
  it('permite registrar un usuario comprador correctamente', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider>
          <RegistroPage />
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Juan Tester' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Contrasena123!' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Contrasena123!' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/registro', expect.any(Object));
      expect(screen.queryByText(/Corrige los errores/)).not.toBeInTheDocument();
    });
  });
});

