const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-schema-decorator');

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

ruleTesterInstance.run('exports-should-schema-decorator', ruleUnderTest, {
  valid: [
    {
      code: '@Schema()\n'
        + 'export class AnySchema {}',
      filename: 'backend/src/library/schemas/test.schema.ts',
    },
  ],
  invalid: [
    {
      code: '@ObjectType()\n'
        + 'export class AnySchema {}',
      errors: [{ message: 'Current file should export class annotated with @Schema decorator' }],
      filename: 'backend/src/library/schemas/test.schema.ts',
    },
  ],
});
