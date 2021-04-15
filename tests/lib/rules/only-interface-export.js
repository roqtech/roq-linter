const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/only-interface-export');

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

ruleTesterInstance.run('only-interface-export', ruleUnderTest, {
  valid: [
    {
      code: 'export interface AuthenticatedRequestInterface extends Request { user: UserEntity }',
      filename: 'backend/src/auth/interfaces/authenticated-request.interface.ts',
    },
  ],
  invalid: [
    {
      code: 'export type JwtTokenType = string',
      errors: [{ message: 'This file should only export an Interface' }],
      filename: 'backend/src/auth/interfaces/jwt-token.type.ts',
    },
  ],
});
