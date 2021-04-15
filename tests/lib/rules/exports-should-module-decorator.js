const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-module-decorator');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('exports-should-module-decorator', ruleUnderTest, {
  valid: [{
    code: `
      @Global()
      @Module({
        controllers: [],
        providers: [],
      })
      export class UserModule {}
    `,
    filename: 'backend/src/user/user.module.ts',
  }],

  invalid: [{
    code: `
      export class UserModule {}
    `,
    errors: [{ message: 'Export have not module decorator' }],
    filename: 'backend/src/user/user.module.ts',
  }],
});
