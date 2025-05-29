// 📁 components/tests/DashboardVendedor.test.jsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

// Mocks de componentes pesados
jest.mock('@/components/DashboardVendedor/GraficoEvolucion', () => () => <div>Mock Grafico</div>);
jest.mock('@/components/DashboardVendedor/TopClientes', () => () => <div>Mock TopClientes</div>);
jest.mock('@/components/DashboardVendedor/TopProductos', () => () => <div>Mock TopProductos</div>);
jest.mock('@/components/DashboardVendedor/ResumenRanking', () => () => <div>Mock Ranking</div>);
jest.mock('@/components/DashboardVendedor/ResumenVentas', () => () => <div>Mock Ventas</div>);
jest.mock('@/components/DashboardVendedor/ResenasRecientes', () => () => <div>Mock Reseñas</div>);
jest.mock('@/components/DashboardVendedor/TablaDevoluciones', () => () => <div>Mock Tabla</div>);
jest.mock('@/components/DashboardVendedor/DashboardResumenVendedor', () => () => <div>Mock Resumen</div>);

// 🔁 Este bloque lo reemplazamos dinámicamente en cada describe
let mockedUseAuth = jest.fn();

// ✅ Mock del hook de autenticación
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockedUseAuth(),
}));

// ✅ Mocks globales
const mockAddImage = jest.fn();
const mockSave = jest.fn();

jest.mock('react-hot-toast', () => {
  const originalModule = jest.requireActual('react-hot-toast');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      error: jest.fn(),
    },
  };
});

global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: mockAddImage,
    save: mockSave,
    internal: {
      pageSize: {
        getWidth: () => 210,
      },
    },
    getImageProperties: () => ({ width: 100, height: 100 }),
  }));
});

jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({ toDataURL: () => 'fake-data-url' })));

// ✅ Polyfill para matchMedia (evita error con react-hot-toast)
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

const jsPDF = require('jspdf');

describe('DashboardVendedor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Acceso no autorizado', () => {
    it('no muestra el dashboard si el usuario no está autenticado', async () => {
      mockedUseAuth.mockReturnValue({ user: null, token: null, isAuthenticated: () => false });

      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      await waitFor(() => {
        expect(screen.getByText(/acceso no autorizado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Acceso autorizado', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        user: {
          id: 1,
          nombre: 'Juan Pérez',
          correo: 'juan@example.com',
          rol: 'vendedor',
          fotoPerfil: '',
        },
        token: 'fake-token',
        isAuthenticated: () => true,
      });
    });

    it('renderiza correctamente el dashboard con datos del vendedor', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      await waitFor(() => {
        expect(screen.getByText(/dashboard del vendedor/i)).toBeInTheDocument();
      });
    });

    it('exporta correctamente a PDF al ejecutar exportarPDF', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const dashboardDiv = document.createElement('div');
      dashboardDiv.id = 'resumen-pdf';
      document.body.appendChild(dashboardDiv);

      const exportButton = screen.getAllByText(/exportar resumen a PDF/i)[0];
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(require('html2canvas')).toHaveBeenCalled();
        expect(mockAddImage).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalledWith('resumen-vendedor.pdf');
      });

      dashboardDiv.remove();
    });

    it('muestra mensaje si no hay productos encontrados', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      await waitFor(() => {
        expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
      });
    });

    it('muestra error si fetch falla', async () => {
      const toast = require('react-hot-toast').default;
      global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Falló el fetch')));
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al obtener pedidos');
      });
    });

    it('permite cambiar las fechas de filtrado', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const inputDesde = screen.getAllByLabelText(/desde/i)[0];
      const inputHasta = screen.getAllByLabelText(/hasta/i)[0];

      fireEvent.change(inputDesde, { target: { value: '2025-01-01' } });
      fireEvent.change(inputHasta, { target: { value: '2025-05-31' } });

      expect(inputDesde.value).toBe('2025-01-01');
      expect(inputHasta.value).toBe('2025-05-31');
    });

    it('permite seleccionar una categoría del filtro', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const selectCategoria = screen.getAllByLabelText(/categoría/i)[0];

      fireEvent.change(selectCategoria, { target: { value: 'combo' } });

      expect(selectCategoria.value).toBe('combo');
    });

    it('permite seleccionar un año del filtro', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const selectAnio = screen.getByLabelText(/año/i);
      fireEvent.change(selectAnio, { target: { value: '2023' } });

      expect(selectAnio.value).toBe('2023');
    });

    it('restablece las fechas al hacer clic en el botón correspondiente', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const inputDesde = screen.getAllByLabelText(/desde/i)[0];
      const inputHasta = screen.getAllByLabelText(/hasta/i)[0];
      const resetButton = screen.getByText(/restablecer fechas/i);

      fireEvent.change(inputDesde, { target: { value: '2025-01-01' } });
      fireEvent.change(inputHasta, { target: { value: '2025-05-31' } });

      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(inputDesde.value).not.toBe('2025-01-01');
        expect(inputHasta.value).not.toBe('2025-05-31');
      });
    });

    it('envía correo de prueba al hacer clic en el botón', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const toast = require('react-hot-toast').default;
      const correoButton = screen.getAllByText(/enviar correo de prueba/i)[0];

      fireEvent.click(correoButton);

      await waitFor(() => {
        expect(toast.error).not.toHaveBeenCalled();
      });
    });

    it('permite seleccionar tipo de reseña del filtro', async () => {
      const DashboardVendedor = require('@/pages/vendedor/dashboard-vendedor').default;
      render(<DashboardVendedor />);

      const selectTipo = screen.getByLabelText(/tipo/i);
      fireEvent.change(selectTipo, { target: { value: 'negativas' } });

      expect(selectTipo.value).toBe('negativas');
    });
  });
});
