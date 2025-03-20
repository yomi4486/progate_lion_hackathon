/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // ts-jest に ESM を使用させる
  },
  extensionsToTreatAsEsm: [".ts"], // TypeScript ファイルを ESM として扱う
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // ESM の拡張子解決
  },
};