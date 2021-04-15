const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-object-type-decorator');

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

ruleTesterInstance.run('exports-should-object-type-decorator', ruleUnderTest, {
  valid: [{
    code: `
      @ObjectType()
      export class UserModel{
        @Field(() => ID)
        id: string;
      }
    `,
    filename: 'backend/src/user/models/user.model.ts',
  }],
  invalid: [{
    code: `
      @Entity()
      export class UserModel{
        @Field(() => ID)
        id: string;
      }
    `,
    errors: [{ message: 'Current file should export a class annotated with @ObjectType decorator' }],
    filename: 'backend/src/user/models/user.model.ts',
  }],
});
