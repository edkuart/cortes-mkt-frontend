// 📄 jest.setup.js

require('@testing-library/jest-dom');

jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'fake-canvas-data-url',
})));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
  }));
});

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => children,
}));
