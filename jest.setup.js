// 📄 jest.setup.js

// Requerimos las extensiones de jest-dom para pruebas más fáciles
require('@testing-library/jest-dom');

// Mock de html2canvas
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'fake-canvas-data-url', // URL simulada de imagen
})));

// Mock de jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addImage: jest.fn(), // Simula la adición de una imagen
      save: jest.fn(), // Simula la función save
    };
  });
});

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>, // Mock de GoogleOAuthProvider para las pruebas
}));