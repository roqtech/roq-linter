const { RuleTester } = require('eslint');
const { resolve } = require('path');
const ruleUnderTest = require('../../../lib/rules/only-layouts-location');

const testDummiesBasePath = resolve('./tests/dummies');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('only-layouts-location', ruleUnderTest, {
  valid: [
    {
      code: 'export const AuthLayout: FunctionComponent<> = () => {}',
      filename: resolve(testDummiesBasePath, 'frontend/src/layouts/auth/auth.layout.tsx'),
    },
  ],
  invalid: [
    {
      code: 'export const Auth: FunctionComponent<> = () => {}',
      errors: [{ message: 'This file should export only layout' }],
      filename: resolve(testDummiesBasePath, 'frontend/src/layouts/auth/auth.layout.tsx'),
    },
    {
      code: 'export const MainLayout: FunctionComponent<> = () => {}',
      errors: [{
        messageId: 'missingLayoutFile',
        data: {
          layoutFileName: 'main.layout.tsx',
          dirPath: resolve(testDummiesBasePath, 'frontend/src/layouts/main'),
        },
      }],
      filename: resolve(testDummiesBasePath, 'frontend/src/layouts/main/main.tsx'),
    },
  ],
});
