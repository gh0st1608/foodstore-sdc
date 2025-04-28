/*const esModules = ['@rimac'].join('|');*/

module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/infrastructure/repository/*',
    '!src/**/infrastructure/repository/**/*',
    //'!src/**/infrastructure/services/*',
    //'!src/**/infrastructure/services/**/*',
    //'!src/**/infrastructure/mapper/*',
    //'!src/**/infrastructure/mapper/**/*',
    '!src/**/**Module.ts',
    '!src/main.ts'
  ],
  rootDir: ".",
  testMatch: ['**/*.steps.ts'],
  coveragePathIgnorePatterns: ['src/common/(?!infrastructure/guards)'],
  coverageDirectory: "./coverage",
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  },
  //transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  //setupFiles: ['./test/setEnvVars.js']
};
