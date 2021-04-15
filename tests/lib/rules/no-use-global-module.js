const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-use-global-module');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTesterInstance.run('no-use-global-modules', ruleUnderTest, {
  valid: [
    {
      code: '',
      filename: 'backend/src/auth/auth.module.ts',
    },
    {
      code: '/* In root module */ \n import { ConfigModule } from \'@nestjs/config\';',
      errors: [{ message: 'Don\'t use nestJs global module' },
      ],
      filename: 'backend/src/app.module.ts',
      options: [['ConfigModule']],
    },
  ],
  invalid: [
    {
      code: 'import { ConfigModule } from \'@nestjs/config\';',
      errors: [{ message: 'Don\'t use nestJs global module' },
      ],
      filename: 'backend/src/auth/auth.module.ts',
      options: [['ConfigModule']],
    },
  ],
});
