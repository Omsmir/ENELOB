const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");
// jest.config.ts
const { compilerOptions } = require('./tsconfig.json');
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // preset: "ts-jest",
  // resetMocks: true,
  // restoreMocks: true,
  // clearMocks:true,
  // testEnvironment: "node",
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/src',
  // }),
  // roots: ['<rootDir>/src'],
  // testMatch:["**/**/*.test.ts"],
  // forceExit:true,
  // verbose:true

  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  maxConcurrency: 4,
};