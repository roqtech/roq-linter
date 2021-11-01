const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/entities-should-follow-conventions');

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

ruleTesterInstance.run('entities-should-follow-conventions', ruleUnderTest, {
  valid: [
    {
      code: '@Entity({name: "user_data"})\n'
        + 'export class UserData {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      filename: 'backend/src/auth/entities/user-data.entity.ts',
    },
  ],
  invalid: [
    {
      code: '@ObjectType()\n'
        + 'export class UserData {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      errors: [{ message: 'Current file should export class annotated with @Entity decorator' }],
      filename: 'backend/src/auth/entities/user-data.entity.ts',
    },
    {
      code: '@Entity({name: "userData"})\n'
        + 'export class UserData {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      errors: [{ message: 'The value for the "name" parameter should be user_data as it should match the snake cased file name' }],
      filename: 'backend/src/auth/entities/user-data.entity.ts',
    },
    {
      code: '@Entity()\n'
        + 'export class UserData {\n'
        + '  @PrimaryGeneratedColumn(\'uuid\')\n'
        + '  id: string; }',
      errors: [{ message: 'The @Entity decorator should have a "name" parameter with value user_data to specify the database table name' }],
      filename: 'backend/src/auth/entities/user-data.entity.ts',
    },
  ],
});
