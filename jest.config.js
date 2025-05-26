// 📄 jest.config.js

module.exports = {
  testEnvironment: 'jsdom',  // Especifica el entorno de pruebas de jsdom (para trabajar con el DOM)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Transforma los archivos js/tsx con babel-jest
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Permite importar CSS como módulos
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Asegúrate de que la configuración de jest-dom esté cargada
  transformIgnorePatterns: ['/node_modules/(?!@react-oauth)/'], // Permite transformar librerías de node_modules si es necesario
};



