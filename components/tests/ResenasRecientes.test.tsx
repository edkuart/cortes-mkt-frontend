// 📁 components/tests/ResenasRecientes.test.tsx

import { render, screen } from '@testing-library/react';
import ResenasRecientes from '@/components/DashboardVendedor/ResenasRecientes';
import '@testing-library/jest-dom';

// 🔧 Mocks necesarios para evitar errores con canvas (jsPDF y html2canvas)
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    addPage: jest.fn()
  }))
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mockdata'
  })
}));

const mockResenas = [
  {
    id: 1,
    comentario: 'Excelente calidad',
    calificacion: 5,
    createdAt: '2025-05-01',
    Comprador: { nombreCompleto: 'Juan Pérez' }
  },
  {
    id: 2,
    comentario: 'Regular, esperaba más',
    calificacion: 3,
    createdAt: '2025-05-02',
    Comprador: { nombreCompleto: 'Ana Gómez' }
  },
  {
    id: 3,
    comentario: 'Muy mala experiencia',
    calificacion: 1,
    createdAt: '2025-05-03',
    Comprador: { nombreCompleto: 'Carlos Ruiz' }
  }
];

describe('ResenasRecientes', () => {
  it('muestra todas las reseñas por defecto', () => {
    render(<ResenasRecientes resenas={mockResenas} filtro="todas" setFiltro={() => {}} />);

    expect(screen.getByText((t) => t.includes('Excelente calidad'))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes('Regular, esperaba más'))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes('Muy mala experiencia'))).toBeInTheDocument();
  });

  it('muestra solo reseñas positivas si filtro=positivas', () => {
    render(<ResenasRecientes resenas={mockResenas} filtro="positivas" setFiltro={() => {}} />);

    expect(screen.getByText((t) => t.includes('Excelente calidad'))).toBeInTheDocument();
    expect(screen.queryByText((t) => t.includes('Regular, esperaba más'))).not.toBeInTheDocument();
    expect(screen.queryByText((t) => t.includes('Muy mala experiencia'))).not.toBeInTheDocument();
  });

  it('muestra solo reseñas negativas si filtro=negativas', () => {
    render(<ResenasRecientes resenas={mockResenas} filtro="negativas" setFiltro={() => {}} />);

    expect(screen.getByText((t) => t.includes('Muy mala experiencia'))).toBeInTheDocument();
    expect(screen.queryByText((t) => t.includes('Excelente calidad'))).not.toBeInTheDocument();
    expect(screen.queryByText((t) => t.includes('Regular, esperaba más'))).not.toBeInTheDocument();
  });
});

