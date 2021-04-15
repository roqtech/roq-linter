const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/correct-location-enums-types-interfaces');

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

ruleTesterInstance.run('correct-location-enums-types-interfaces', ruleUnderTest, {
  valid: [
    {
      code: 'export interface AnyInterface {\n'
        + 'anyKey: string\n'
        + '}\n'
        + '\n'
        + 'console.log(AnyInterface)',
      filename: 'frontend/src/common/roq-ui/button/button.tsx',
    },
  ],
  invalid: [
    {
      code: 'export interface AnyInterface {\n'
        + 'anyKey: string\n'
        + '}',
      errors: [{ message: 'Enums, Types and Interfaces should be placed in the same file with associated component' }],
      filename: 'frontend/src/common/roq-ui/button/button.tsx',
    },
  ],
});
