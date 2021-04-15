const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-scalar-decorator');

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

ruleTesterInstance.run('exports-should-scalar-decorator', ruleUnderTest, {
  valid: [
    {
      code: '@Scalar()\n'
        + 'export class AnyObjectScalar {}',
      filename: 'backend/src/library/scalars/custom.object.scalar.ts',
    },
  ],
  invalid: [
    {
      code: '@ObjectType()\n'
        + 'export class AnyObjectScalar {}',
      errors: [{ message: 'Current file should export class annotated with @Scalar decorator' }],
      filename: 'backend/src/library/scalars/custom.object.scalar.ts',
    },
  ],
});
