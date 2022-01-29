import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>/src'],
  //preset: 'ts-jest/presets/default-esm', // or other ESM presets
  preset: 'ts-jest/presets/js-with-ts-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
}
export default config
