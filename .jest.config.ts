import type { Config } from "jest";
const SSXCore = require("./packages/ssx-core/package.json");
const SSXSDK = require("./packages/ssx-sdk/package.json");
const SSXServer = require("./packages/ssx-server/package.json");

export default async (): Promise<Config> => ({
  verbose: true,
  collectCoverage: true,
  bail: 0,
  preset: "ts-jest",
  clearMocks: true,
  slowTestThreshold: 3,
  coverageProvider: "v8",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text-summary"],
  projects: [
    {
      displayName: SSXCore.name,
      transform: {
        "^.+\\.(ts|tsx)?$": [
          "ts-jest",
          { tsconfig: "<rootDir>/packages/ssx-core/tsconfig.json" },
        ],
      },
      testMatch: [
        "<rootDir>/packages/ssx-core/tests/?(*.)+(spec|test).[jt]s?(x)",
      ],
    },
    {
      displayName: SSXSDK.name,
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.(ts|tsx)?$": [
          "ts-jest",
          { tsconfig: "<rootDir>/packages/ssx-sdk/tsconfig.json" },
        ],
      },
      testMatch: [
        "<rootDir>/packages/ssx-sdk/tests/?(*.)+(spec|test).[jt]s?(x)",
      ],
    },
    {
      displayName: SSXServer.name,
      transform: {
        "^.+\\.(ts|tsx)?$": [
          "ts-jest",
          { tsconfig: "<rootDir>/packages/ssx-server/tsconfig.json" },
        ],
      },
      testMatch: [
        "<rootDir>/packages/ssx-server/tests/?(*.)+(spec|test).[jt]s?(x)",
      ],
    },
  ],
});
