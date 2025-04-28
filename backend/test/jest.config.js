module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: ".",

  collectCoverageFrom: [
    "src/**/*.ts",
    "test/feature/**/*.ts", // Incluir solo los archivos en test/feature/
    "!src/**/infrastructure/repository/**",
    "!src/**/infrastructure/mapper/**",
    "!src/**/**Module.ts",
    "!src/main.ts",
  ],

  testMatch: [
    "**/test/feature/**/*.steps.ts", // Archivos de pruebas BDD (jest-cucumber)
    "**/test/feature/**/*.test.ts",  // Archivos unitarios terminados en .test.ts
  ],

  coveragePathIgnorePatterns: [
    "src/common/(?!infrastructure/guards)",
  ],

  coverageDirectory: "./coverage",
  verbose: true, // Muestra detalles de los tests en consola

  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest",
  },
};
