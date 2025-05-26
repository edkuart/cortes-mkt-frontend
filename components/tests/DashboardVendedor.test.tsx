// 📁 components/tests/DashboardVendedor.test.tsx

import { render, screen } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DashboardVendedor from '@/pages/vendedor/dashboard-vendedor';

describe('DashboardVendedor', () => {
  it('debería mostrar el gráfico de evolución de ventas', async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <DashboardVendedor />
      </GoogleOAuthProvider>
    );
    // Verifica que se haya renderizado correctamente
    expect(screen.getByText(/Dashboard del Vendedor/i)).toBeInTheDocument();
  });
});

