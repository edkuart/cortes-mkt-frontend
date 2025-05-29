// 📁 components/tests/DashboardVendedor.test.tsx

import { render, screen } from '@testing-library/react';
import DashboardVendedor from '@/pages/vendedor/dashboard-vendedor';
import { useAuth } from '@/hooks/useAuth';

// Mock para usuario no autenticado
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: () => false,
    token: null,
  }),
}));

describe('DashboardVendedor - Acceso no autorizado', () => {
  it('muestra mensaje si el usuario no está autenticado', () => {
    render(<DashboardVendedor />);
    expect(screen.getByText(/acceso no autorizado/i)).toBeInTheDocument();
  });
});


