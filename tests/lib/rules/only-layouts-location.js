const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/only-layouts-location');

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
      filename: 'frontend/src/layouts/auth/auth.layout.tsx',
    },
  ],
  invalid: [
    {
      code: 'export const Auth: FunctionComponent<> = () => {}',
      errors: [{ message: 'This location should have only layouts' }],
      filename: 'frontend/src/layouts/auth/auth.layout.tsx',
    },
    {
      code: 'export const AuthLayout: FunctionComponent<> = () => {}',
      errors: [{ message: 'This location should have only layouts' }],
      filename: 'frontend/src/layouts/auth/auth.tsx',
    },
  ],
});
