// 📄 jest.setup.js

require('@testing-library/jest-dom');

// Mock de html2canvas
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'fake-canvas-data-url',
})));

// Mock de jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
  }));
});

// Mock de GoogleOAuthProvider
jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => children,
}));

// 🩹 Polyfill para ResizeObserver
global.ResizeObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
