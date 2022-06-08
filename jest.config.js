module.exports = {
    testEnvironment: 'node',
    testTimeout: 10000,
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**/*.ts',
        '!./src/examples/**/*.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    modulePathIgnorePatterns: ['dist'],
    preset: 'ts-jest',
    clearMocks: true,
    globalSetup: './jest.setup.js',
};
