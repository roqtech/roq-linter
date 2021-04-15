const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-entity-decorator');

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

ruleTesterInstance.run('exports-should-entity-decorator', ruleUnderTest, {
  valid: [
    {
      code: '@Entity()\n'
        + 'export class AnyEntity {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      filename: 'backend/src/auth/entities/refresh-token.entity.ts',
    },
  ],
  invalid: [
    {
      code: '@ObjectType()\n'
        + 'export class AnyEntity {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      errors: [{ message: 'Current file should export class annotated with @Entity decorator' }],
      filename: 'backend/src/auth/entities/refresh-token.entity.ts',
    },
  ],
});
